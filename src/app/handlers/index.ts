class Handlers {
  static authError(error: any, isLogin: boolean) {
    const { errorResponse } = error || {};

    if (errorResponse?.code === 11000 && !isLogin) {
      return "An account with this email exists";
    } else if (error?.errors?.email?.kind === "regexp") {
      return "Invalid email";
    } else {
      return "An error occurred";
    }
    // --- further checks come in --
  }

  static responseHandler() {}
}

export default Handlers;
