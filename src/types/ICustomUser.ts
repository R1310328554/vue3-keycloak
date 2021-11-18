export default function useUserInfo(userInfo: any): ICustomUser {
  return {
    ID: userInfo['sub'],
    FullName: userInfo['name'],
    FirstName: userInfo['given_name'],
    LastName: userInfo['family_name'],
    isEmailVerified: userInfo['email_verified'],
    Email: userInfo['email'],
    Username: userInfo['preferred_username'],
  }
}

export interface ICustomUser {
  ID?: string,
  FullName?: string,
  FirstName?: string,
  LastName?: string,
  isEmailVerified?: boolean,
  Email?: string,
  Username?: string,
  CalendarID?: string,
  EmrID?: string,
}