import { randomUUID } from "crypto";
import { Op, Transaction } from "sequelize";
import Models from "../../models";
import BaseService from "../base";
import RoleService from "./role";
import {
  EnRoleLevel,
  excludeProp,
  isUploadedFile,
  IUserCreate,
  moveUploadedFile,
  PlatformError,
  userEntity,
} from "@kructzi-dart/universe";

export default class UserService {
  static async create(payload: IUserCreate, transaction?: Transaction) {
    const currentTime = new Date();
    const data = {
      isActive: true,
      ...payload,
      id: randomUUID(),
      createdAt: currentTime,
      updatedAt: currentTime,
    };
    userEntity.parse(data);
    const result = await Models("user").create(
      data,
      transaction ? { transaction } : {},
    );
    return result.toJSON();
  }
  static async getByUniqueField(id: string) {
    const user = await Models("user").FindOne({
      where: {
        isActive: true,
        [Op.or]: [
          {
            username: id,
          },
          {
            email: id,
          },
          {
            id,
          },
        ],
      },
    });
    if (!user) {
      throw new PlatformError("Not Found", { messages: "User not found" });
    }
    return user;
  }
  static async getByUniqueFieldAllowNull(id: string) {
    const user = await Models("user").FindOne({
      where: {
        isActive: true,
        [Op.or]: [
          {
            username: id,
          },
          {
            email: id,
          },
          {
            id,
          },
        ],
      },
    });
    return user;
  }
  static async updateUser(
    id: string,
    payload: Partial<IUserCreate>,
    transaction?: Transaction,
  ) {
    const user = await this.getByUniqueField(id);
    const result = await Models("user").Update(payload, {
      where: { id: user.id },
      ...(transaction ? { transaction } : {}),
    });
    return result;
  }
  static async isProfileCompleted(user: { id: string }) {
    const numberOfRequiredProfileFields = await Models("profile_field").count({
      where: { isActive: true, isRequired: true },
    });
    const numberOfProfileDetailsFilled = await Models("profile_detail").count({
      where: {
        isActive: true,
        createdBy: user.id,
      },
    });
    return numberOfProfileDetailsFilled >= numberOfRequiredProfileFields;
  }
  static async getProfileDetails() {
    const currUserId = BaseService.CurrentUserID();

    const [currUser, profileDetails, allFormFieldName] = await Promise.all([
      this.getByUniqueField(currUserId),
      Models("profile_detail").FindAll({
        where: { isActive: true, userId: currUserId },
      }),
      Models("profile_field").FindAll({
        where: { isActive: true },
      }),
    ]);
    const userData = excludeProp(currUser, "password");
    const profile = allFormFieldName.reduce((acc, field) => {
      acc[field.columnName] =
        profileDetails.find((p) => p.fieldId === field.id)?.answer || null;
      return acc;
    }, {} as Record<string, unknown>);
    const isProfileCompleted = await UserService.isProfileCompleted(userData);
    return { ...userData, ...profile, isProfileCompleted };
  }

  static async updateProfileDetails({
    username,
    email,
    ...rest
  }: {
    username?: string;
    email?: string;
  } & Record<string, unknown>) {
    const transaction = await Models.transaction();
    const currentUser = BaseService.CurrentUserID();

    if (username || email) {
      await this.updateUser(currentUser, { username, email });
    }

    const allFormFields = await Models("profile_field").FindAll({
      where: { isActive: true },
    });

    for (const key in rest) {
      let value = rest[key];
      if (isUploadedFile(value)) {
        value = await moveUploadedFile(value);
      }
      const formFieldId =
        allFormFields.find((t) => t.columnName === key)?.id || "";
      const isProfileDetailsFormFieldExists = await Models(
        "profile_detail",
      ).FindOne({
        where: {
          isActive: true,
          fieldId: formFieldId,
          userId: currentUser,
        },
      });
      if (isProfileDetailsFormFieldExists) {
        await Models("profile_detail").Update(
          { answer: `${value}` },
          {
            where: {
              isActive: true,
              fieldId: formFieldId,
              createdBy: currentUser,
            },
            transaction,
          },
        );
      } else if (formFieldId) {
        await Models("profile_detail").Create(
          {
            answer: `${value}`,
            fieldId: formFieldId,
          },
          { transaction },
        );
      }
    }
    await transaction.commit();
    return true;
  }

  static async deleteUser(id: string) {
    const user = await this.getByUniqueField(id);
    const adminRole = await RoleService.get(EnRoleLevel.SuperAdmin);
    if (!adminRole) {
      throw new PlatformError("Not Found", {
        messages: "Super Admin Role not found",
      });
    }
    if (user.roleId === adminRole.id) {
      throw new PlatformError("Forbidden", {
        messages: "Can not delete Super Admin",
      });
    }
    const deletedBy = BaseService.CurrentUserID();
    const transaction = await Models.transaction();
    await Models("profile_detail").Update(
      {
        isActive: false,
      },
      {
        where: {
          createdBy: user.id,
        },
        transaction,
      },
    );
    await Models("user").Update(
      {
        isActive: false,
        deletedAt: new Date(),
        deletedBy,
      },
      {
        where: {
          id: user.id,
        },
        transaction,
      },
    );
    await transaction.commit();
    return true;
  }

  //   static async getAllUser() {
  //     const formFields = await Models("form_field").FindAll({
  //       where: {
  //         isActive: true,
  //         type: EnFormType.Profile,
  //       },
  //     });

  //     const allUsers = await Models("user").FindAll({
  //       where: {
  //         isActive: true,
  //       },
  //     });
  //     const profileDetails = await Models("profile_detail").FindAll({
  //       where: {
  //         isActive: true,
  //         userId: { [Op.in]: allUsers.map((user) => user.id) },
  //       },
  //     });
  //     const result = allUsers.map((user) => {
  //       const profiles = profileDetails.filter((p) => p.userId === user.id);
  //       const temp: Record<string, unknown> = { ...user };
  //       for (const p of profiles) {
  //         const field = formFields.find((f) => f.id === p.fieldId);
  //         if (field) {
  //           temp[field.fieldCode] = p.answer;
  //         }
  //       }
  //       return temp;
  //     });
  //     return result;
  //   }
}
