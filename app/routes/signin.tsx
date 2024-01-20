import { useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";

const schema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email invalid" }),
  password: z.string({ required_error: "Password is required" }).min(8),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parse(formData, {
    schema: schema.superRefine((data, ctx) => {
      const { password } = data;

      if (password !== "12345678") {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Password do not match",
        });
      }
      return;
    }),
  });

  if (submission.intent !== "submit" || !submission.value) {
    return json(submission);
  }

  return redirect("/");
}

export default function Login() {
  const lastSubmission = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastSubmission: lastSubmission,

    onValidate({ formData }) {
      return parse(formData, { schema });
    },
  });

  return (
    <>
      <main className="flex flex-col justify-center min-h-full">
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-2xl text-center font-bold leading-9 tracking-tighter mt-10">
            Sign In
          </h1>
        </div>

        <div className="mx-auto w-full max-w-md">
          <Form className="space-y-6" method="post" {...form.props}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div>{fields.email.errors}</div>
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                />
              </div>
              {fields.password.errors}
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </Form>
          <div className="mx-auto w-full">
            <pre> {JSON.stringify(lastSubmission, null, 2)}</pre>
          </div>
        </div>
      </main>
    </>
  );
}
