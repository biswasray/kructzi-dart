// import { CoreContext } from "@theinternetfolks/context";
import { EnRoleLevel, IUser, PlatformError } from "@kructzi-dart/universe";
import httpContext from "express-http-context";
import { Transaction } from "sequelize";

export default class BaseService {
  static readonly CurrentUserKey = "currentUser";
  static readonly CurrentTransaction = "currentTransaction";
  static GetTransaction() {
    const transaction = <Transaction | null | undefined>(
      httpContext.get(this.CurrentTransaction)
    );
    return transaction;
  }
  static SetTransaction(transaction: Transaction) {
    httpContext.set(this.CurrentTransaction, transaction);
  }
  static CurrentUser() {
    const user = <
      | (IUser & {
          role: {
            level: number;
            name: string;
          } | null;
        })
      | undefined
    >httpContext.get(this.CurrentUserKey);
    // const user: IUser = {
    //   id: "a9d32142-22b4-4c1f-bc88-b89a32599eb2",
    //   //   firstName: "John",
    //   //   lastName: "Doe",
    //   //   name: "John",
    //   username: "john.doe",
    //   email: "john.doe@gmail.com",
    //   password: "Internet@123",
    //   roleId: "8ac8157a-7bd4-4dd5-8145-18f894f83a34",
    //   name: "",
    //   mobile: "",
    //   isActive: false,
    //   createdAt: new Date("2023-07-21T08:00:02.472Z"),
    //   updatedAt: new Date("2023-07-21T08:00:02.472Z"),
    // };
    if (!user) {
      throw new PlatformError("Not Found", {
        messages: "Authorized User",
      });
    }
    return user;
  }
  static CurrentUserName() {
    return this.CurrentUser().username;
  }
  static CurrentUserID() {
    return this.CurrentUser().id;
  }
  static CurrentUserRoleId() {
    return this.CurrentUser().roleId;
  }
  static CurrentUserRole() {
    const { role } = this.CurrentUser();
    if (!role) {
      throw new PlatformError("Method Failure", {
        messages: "Invalid User Role",
      });
    }
    return role;
  }
  static IsUserSuperAdmin() {
    return this.CurrentUserRole().level === EnRoleLevel.SuperAdmin;
  }
}
