export const ErrorCode = Object.freeze({
    CREDENTIALS_NOT_GIVEN_OR_NOT_FOUND: "404x1 Required credentials not found or not given",
    PROVIDE_VAILD_EMAIL: "400x1 Not a vaild email provide a vaild email",
    PASSWORD_INVAILD: "400x2 both password and confirm password didn't match",
    EMAIL_TAKEN: "400x3 email is in use",
    USERNAME_TAKEN: "400x4 username is in use",
});