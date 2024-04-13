type saveUserDb = {
  user: string;
};

const saveUserDb = ({ user }: saveUserDb) => {
  console.log(user);
};

saveUserDb({ user: "alex matos" });
