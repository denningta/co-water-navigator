import { Tooltip } from "@mui/material"
import axios from "axios"
import { Field, Form, Formik, FormikHelpers } from "formik"
import { useSnackbar } from "notistack"
import { useState } from "react"
import { FaSave } from "react-icons/fa"
import { ImUndo } from "react-icons/im"
import useAgentInfo from "../../../hooks/useAgentInfo"
import Button from "../../common/Button"

export interface FormData {
  [key: string]: {
    value: string,
    title: string
    colspan: number
    placeholder?: string
  }
}

const formData: FormData = {
  firstName: {
    value: '',
    title: 'First Name',
    colspan: 2,
    placeholder: ''
  },
  lastName: {
    value: '',
    title: 'Last Name',
    colspan: 2,
    placeholder: ''
  },
  agentFor: {
    value: '',
    title: 'Agent For',
    placeholder: 'Ex: Castle Rock, Front Range Resources, etc.',
    colspan: 2,
  },
  phone: {
    value: '',
    title: 'Phone Number',
    colspan: 2,
    placeholder: ''
  },
  address: {
    value: '',
    title: 'Address',
    colspan: 4,
    placeholder: ''
  },
  city: {
    value: '',
    title: 'City',
    colspan: 2,
    placeholder: ''
  },
  state: {
    value: '',
    title: 'State',
    colspan: 2,
    placeholder: ''
  },
  zip: {
    value: '',
    title: 'Postal Code',
    colspan: 2,
    placeholder: ''
  },
}

interface ReportingAgentFormProps {
  user_id?: string | undefined | null
  permitNumber?: string | 'global'
  subTitle?: string | React.ReactNode
}

const ReportingAgentForm = ({
  user_id,
  permitNumber = 'global',
  subTitle
}: ReportingAgentFormProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const { data, mutate } = useAgentInfo(user_id ?? null, permitNumber)
  console.log(data)
  const [loading, setLoading] = useState(false)

  const formKeys = Object.keys(formData) as (keyof typeof formData)[]
  const initialValues = formKeys.reduce((prev, curr) => ({ ...prev, [curr]: (data && data[curr]) ?? '' }), {})

  const handleSubmit = async (values: any, formikHelpers: FormikHelpers<{}>) => {
    setLoading(true)
    if (!user_id) return

    const updateData = {
      ...values,
      user_id: user_id,
      permitNumber: permitNumber
    }

    try {
      await axios.post(`/api/auth/${user_id}/agent-info?permitNumber=${permitNumber}`, updateData)
      enqueueSnackbar('Success! Agent information updated.', { variant: 'success' })
      mutate(data)
      setLoading(false)
    } catch (error: any) {
      enqueueSnackbar('Something went wrong.  Try again.', { variant: 'error' })
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await axios.delete(`/api/auth/${user_id}/agent-info?permitNumber=${permitNumber}`)
      enqueueSnackbar(`Removed agent info for ${permitNumber}`, { variant: 'success' })
      mutate(data)

      setLoading(false)
    } catch (error: any) {
      enqueueSnackbar('Something went wrong.  Try again.', { variant: 'error' })
      setLoading(false)
      throw new Error(error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 text-xl font-bold">Reporting Agent Information</div>
      <div>{subTitle}</div>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        <Form>
          <div className="grid grid-cols-4 gap-6 max-w-[800px]">
            {formKeys.map(formKey =>
              <div key={formKey}
                className="flex flex-col"
                style={{ gridColumn: `span ${formData[formKey].colspan} / span ${formData[formKey].colspan}` }}
              >
                <label htmlFor={formKey.toString()} className="mb-1">{formData[formKey].title}</label>
                <Field
                  id={formKey}
                  name={formKey}
                  className="bg-gray-100 outline-primary-500 border border-gray-300 py-2 px-3 rounded"
                  placeholder={formData[formKey].placeholder}
                />
              </div>
            )}
          </div>
          <div className="mt-6 flex space-x-4">
            <Button
              title="Save"
              icon={<FaSave />}
              type="submit"
              isLoading={loading}
            />
            {permitNumber !== 'global' && data?.permitNumber !== 'global' &&
              <Tooltip title="Use the agent information defined in your profile">
                <div>
                  <Button
                    title={"Revert to global"}
                    icon={<ImUndo />}
                    color="secondary"
                    isLoading={loading}
                    onClick={handleDelete}
                  />
                </div>
              </Tooltip>
            }
          </div>
        </Form>
      </Formik>
    </div>
  )

}

export default ReportingAgentForm
