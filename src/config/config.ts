const config = (key: string) => {
  const configKeys: any = {
    jwt_key: process.env.JWT_SECRET_KEY || "",

    dbURL:
      process.env.NODE_ENV === "production"
        ? process.env.PROD_DATABASE
        : process.env.DEV_DATABASE,
  };

  return configKeys[key];
};

export default config;
