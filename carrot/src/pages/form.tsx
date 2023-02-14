import { FieldErrors, useForm } from "react-hook-form";

interface FormTypes {
  username: string;
  password: string;
  email: string;
}

const Forms = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormTypes>({ mode: "onChange" });

  const onValid = (data: FormTypes) => {
    console.log(data);
  };
  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  console.log(errors);

  return (
    <>
      <form onSubmit={handleSubmit(onValid, onInvalid)}>
        <input
          {...register("username", {
            required: "Username is required",
            minLength: { message: "The username should be longer than 5 chars.", value: 5 },
          })}
          type="text"
          placeholder="username"
        />
        <input
          {...register("email", {
            required: "Email is required",
            validate: {
              notGmail: value => !value.includes("@gmail.com") || "Gmail is not allowed!",
            },
          })}
          type="email"
          placeholder="Email"
          className={`${Boolean(errors.email) ? "border-red-500" : ""}`}
        />
        <input
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
        />
        <input type="submit" value="submit" />
      </form>
      {errors.email?.message}
    </>
  );
};

export default Forms;
