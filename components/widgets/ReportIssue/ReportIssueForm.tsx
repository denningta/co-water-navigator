import { useUser } from "@auth0/nextjs-auth0"
import { Field, Form, Formik, FormikHelpers } from "formik"
import Link from "next/link"
import { Octokit } from "octokit"
import { useState } from "react"
import Button from "../../common/Button"

const initialValues = {
  title: '',
  body: `- What were you doing?

- What did you expect to happen?

- What happened instead?

- Can you replicate the problem?

`,
}

const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN
})


const ReportIssueForm = () => {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [htmlUrl, setHtmlUrl] = useState(undefined)

  const handleSubmit = async (values: typeof initialValues, formikHelpers: FormikHelpers<typeof initialValues>) => {
    try {
      const res = await fetch('/api/github/issue', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values)
      })

      const jsonRes = await res.json()

      setHtmlUrl(jsonRes.data.html_url)

      setSubmitted(true)
    } catch (e: any) {
      throw new Error(e)
    }
    return {}
  }


  return (
    <>
      {!submitted &&
        <>
          <div>
            <Formik
              initialValues={initialValues}
              enableReinitialise={true}
              onSubmit={handleSubmit}
            >
              <Form className="w-full">
                <div className="grid gap-6">
                  <Field
                    id="title"
                    name="title"
                    placeholder="Issue Title"
                    className=" bg-gray-100 outline-primary-500 border border-gray-300 py-2 px-3 rounded"
                  />
                  <Field
                    id="body"
                    name="body"
                    placeholder="Describe the problem"
                    as="textarea"
                    className="min-h-[300px] bg-gray-100 outline-primary-500 border border-gray-300 py-2 px-3 rounded"
                  />
                </div>

                <div className="mt-6">
                  <Button title="Submit" type="submit" isLoading={loading} />
                </div>
              </Form>
            </Formik>
          </div>
        </>
      }
      {submitted &&
        <div className="flex flex-col items-center">
          <div>Thank you for reporting this issue.</div>
          {htmlUrl &&
            <div>
              You can follow up on your issue <Link href={htmlUrl}>here</Link>
            </div>
          }

          <div className="mt-6">
            <Button
              title="Submit another issue"
              type="button"
              isLoading={loading}
              onClick={() => setSubmitted(false)}
            />
          </div>
        </div>

      }
    </>
  )

}

export default ReportIssueForm
