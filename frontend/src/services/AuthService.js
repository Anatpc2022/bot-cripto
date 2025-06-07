export async function doLogin(email, password) {
  if (email === "ana.tpc2022@gmail.com" && password === "Lanna0210") {
    return {
      id: 1,
      token: "token",
    };
  }
  throw new Error("401");
}

export async function doLogout() {
  return true;
}
