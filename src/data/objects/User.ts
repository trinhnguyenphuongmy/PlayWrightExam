export class User {
  constructor(private username: string, private password: string) {}

  getUsername() {
    return this.username;
  }

  getPassword() {
    return this.password;
  }
}
