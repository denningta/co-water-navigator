import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Step, StepButton, Stepper, useMediaQuery, useTheme } from "@mui/material"
import { Field, Form, Formik, FormikErrors, FormikHelpers } from "formik"
import { useState } from "react"
import { FaCheck } from "react-icons/fa"
import Button from "./Button"
import * as Yup from 'yup'
import { IoClose } from "react-icons/io5"
import WellPermitsRecordsManager from "../widgets/WellPermitsRecordsManager/WellPermitRecordsManager"

const steps = (year: string | undefined) => ([
  {
    label: 'Starting Year',
    fields: ['year']
  },
  {
    label: `${year && +year && +year - 1} DBB-013`,
    fields: ['originalAppropriation', 'allowedAppropriation', 'bankingReserveLastYear']
  },
  {
    label: 'Permit Data',
    fields: ['permitData']
  },
])

const getInitialValues = (permitNumber: string | undefined, year: string | undefined) => {
  return {
    permitNumber: permitNumber ?? '',
    year: year ?? '',
    originalAppropriation: '',
    allowedAppropriation: '',
    bankingReserveLastYear: '',
    totalPumpedThisYear: '',
    permitData: ''
  }
}

export type InitializeWellFormValues = ReturnType<typeof getInitialValues>

const inputClass = 'bg-gray-100 outline-primary-500 border border-gray-300 py-2 px-3 rounded'

const ValidationSchema = Yup.object().shape({
  year: Yup.number()
    .typeError('Enter a valid 4 digit year')
    .required('Required')
    .positive('Enter a valid 4 digit year')
    .integer('Enter a valid 4 digit year')
    .min(1000, 'Enter a valid 4 digit year')
    .max(new Date().getFullYear(), `Enter a year in the past`),
  originalAppropriation: Yup.number()
    .required('Required')
    .typeError('Value must be a number'),
  allowedAppropriation: Yup.number()
    .required('Required')
    .typeError('Value must be a number'),
  bankingReserveLastYear: Yup.number()
    .required('Required')
    .typeError('Value must be a number'),
  totalPumpedThisYear: Yup.number()
    .required('Required')
    .typeError('Value must be a number'),
  permitData: Yup.boolean()
    .required('Required')
})

export type InitializeWellWizardProps = {
  dialogProps: DialogProps
  permitnumber?: string
  year?: string
  onFormSubmit?: (values: InitializeWellFormValues, formikHelpers: FormikHelpers<InitializeWellFormValues>) => Promise<InitializeWellFormValues | void> | void
  isLoading?: boolean
}

const InitializeWellWizard = ({ dialogProps, permitnumber, year, onFormSubmit, isLoading = false }: InitializeWellWizardProps) => {
  const [activeStep, setActiveStep] = useState(0)
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({})
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const handleStep = (step: number) => () => {
    setActiveStep(step)
  }

  const totalSteps = () => {
    return steps(year).length
  }

  const completedSteps = () => {
    return Object.keys(completed).length
  }

  const isLastStep = () => {
    return activeStep === totalSteps() - 1
  }

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps()
  }

  const handleComplete = (errors: FormikErrors<ReturnType<typeof getInitialValues>>) => {
    const newCompleted = completed
    const errorFields = Object.keys(errors).filter(value => steps(year)[activeStep].fields?.includes(value))
    if (!errorFields.length) {
      newCompleted[activeStep] = true
      setCompleted(newCompleted)
    } else {
      delete newCompleted[activeStep]
    }
  }

  const handleNext = (errors: FormikErrors<ReturnType<typeof getInitialValues>>) => {
    handleComplete(errors)
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps(year).findIndex((step, i) => !(i in completed))
        : activeStep + 1
    setActiveStep(newActiveStep)
  }

  const handleBack = (errors: FormikErrors<ReturnType<typeof getInitialValues>>) => {
    handleComplete(errors)
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth={true}
      maxWidth={'md'}
      {...dialogProps}
    >
      <Formik
        initialValues={getInitialValues(permitnumber, year)}
        validationSchema={ValidationSchema}
        validateOnMount={true}
        onSubmit={onFormSubmit ?? (() => { })}
      >
        {({ values, errors, touched, setValues }) => {
          const thisYear = () => (!!(+values.year) ? +values.year : 'this year').toString()
          const lastYear = () => (!!(+values.year) ? +values.year - 1 : 'previous year').toString()

          return (

            <Form>
              <div className="flex flex-col justify-center relative">
                <button
                  className="absolute top-5 right-5"
                  onClick={(e) => dialogProps.onClose && dialogProps.onClose(e, "escapeKeyDown")}
                >
                  <IoClose size={25} />
                </button>
                <DialogTitle>
                  <div className="mb-6 text-2xl font-bold">Set up well {permitnumber}</div>
                  <Stepper nonLinear activeStep={activeStep}>
                    {steps(year).map(({ label }, index) => (
                      <Step key={label} completed={completed[index]}>
                        <StepButton disableRipple color="inherit" onClick={handleStep(index)}>
                          {label}
                        </StepButton>
                      </Step>
                    ))}
                  </Stepper>
                </DialogTitle>

                <DialogContent className="grow mt-6">


                  {activeStep === 0 &&
                    <div className="space-y-8">
                      <div className="space-y-2">
                        <p>
                          It looks like there is no data associated with well permit {permitnumber}
                        </p>
                        <p>
                          Lets get you up and running by answering a few questions:
                        </p>
                      </div>
                      <div>
                        <div>What year would you like to begin recording meter readings for this well?</div>
                        <div className="text-sm text-gray-500">(Earlier data can always be entered at a later time)</div>

                        <div className="flex items-center space-x-4">
                          <Field
                            id={'year'}
                            name={'year'}
                            className={`${inputClass} mt-2`}
                            placeholder={'Starting year'}
                          />
                          {values.year && !errors.year && <FaCheck className="text-success-600" />}
                        </div>
                        <div className="h-[20px] text-error-500 text-sm">
                          {errors.year && touched.year && errors.year}
                        </div>
                      </div>
                    </div>
                  }

                  {activeStep === 1 &&

                    <div className="space-y-2">
                      <div className="mb-6">
                        Enter the following data from the
                        <span className="font-extrabold text-xl"> {lastYear()} DBB-013 </span>
                        form for this well.
                      </div>
                      <div>
                        <div>Line 1: Original maximum annual appropriation</div>
                        <div className="flex items-center space-x-4">
                          <Field
                            id={'originalAppropriation'}
                            name={'originalAppropriation'}
                            className={`${inputClass} mt-2 min-w-[300px] md:min-w-[400px]`}
                            placeholder={'Original Annual Appropration'}
                          />
                          {values.originalAppropriation && !errors.originalAppropriation && <FaCheck className="text-success-600" />}
                        </div>
                        <div className="h-[20px] text-error-500 text-sm">
                          {errors.originalAppropriation && touched.originalAppropriation &&
                            errors.originalAppropriation
                          }
                        </div>
                      </div>
                      <div>
                        <div>Line 2: Allowed annual appropriation under the expanded acres or change of use approval</div>
                        <div className="flex items-center space-x-4">
                          <Field
                            id={'allowedAppropriation'}
                            name={'allowedAppropriation'}
                            className={`${inputClass} mt-2 min-w-[300px] md:min-w-[400px]`}
                            placeholder={'Expanded Acres/Change-of-use Appropriation'}
                          />
                          {values.allowedAppropriation && !errors.allowedAppropriation && <FaCheck className="text-success-600" />}
                        </div>
                        <div className="h-[20px] text-error-500 text-sm">
                          {errors.allowedAppropriation && touched.allowedAppropriation &&
                            errors.allowedAppropriation
                          }
                        </div>
                      </div>
                      <div>
                        <div>Line 5: Amount in banking reserve at the end of {+(lastYear()) - 1}</div>
                        <div className="flex items-center space-x-4">
                          <Field
                            id={'bankingReserveLastYear'}
                            name={'bankingReserveLastYear'}
                            className={`${inputClass} mt-2 min-w-[300px] md:min-w-[400px]`}
                            placeholder={`Acre-feet in banking reserve ${lastYear()}`}
                          />
                          {values.bankingReserveLastYear && !errors.bankingReserveLastYear && <FaCheck className="text-success-600" />}
                        </div>
                        <div className="h-[20px] text-error-500 text-sm">
                          {errors.bankingReserveLastYear && touched.bankingReserveLastYear &&
                            errors.bankingReserveLastYear
                          }
                        </div>
                      </div>
                      <div>
                        <div>Line 7: Total amount pumped in {lastYear()}</div>
                        <div className="flex items-center space-x-4">
                          <Field
                            id={'totalPumpedThisYear'}
                            name={'totalPumpedThisYear'}
                            className={`${inputClass} mt-2 min-w-[300px] md:min-w-[400px]`}
                            placeholder={`Total amount pumped in ${lastYear()}`}
                          />
                          {values.totalPumpedThisYear && !errors.totalPumpedThisYear && <FaCheck className="text-success-600" />}
                        </div>
                        <div className="h-[20px] text-error-500 text-sm">
                          {errors.totalPumpedThisYear && touched.totalPumpedThisYear &&
                            errors.totalPumpedThisYear
                          }
                        </div>
                      </div>
                    </div>
                  }

                  {activeStep === 2 &&
                    <div className="space-y-4">
                      <div>
                        Select the record below that should be associated with this well permit or enter custom values
                      </div>
                      <div>This data will be used to populate the DBB-004 and DBB-013 forms and can always be changed later.</div>
                      <WellPermitsRecordsManager
                        permitNumber={permitnumber}
                        onSelectionChanged={(data) => {
                          setValues({
                            ...values,
                            permitData: !data ? '' : true.toString()
                          })
                        }}
                      />
                      <Field
                        id={'permitData'}
                        name={'permitData'}
                        className={'hidden'}
                      />
                    </div>

                  }
                </DialogContent>

                <DialogActions>
                  <Button
                    title={'Previous'}
                    color="secondary"
                    onClick={() => handleBack(errors)}
                    disabled={activeStep === 0}
                  />
                  {!isLastStep() &&
                    <Button
                      title={'Next'}
                      onClick={() => handleNext(errors)}
                      disabled={activeStep === totalSteps() - 1}
                    />
                  }
                  {isLastStep() &&
                    <Button
                      title={'Finish'}
                      type="submit"
                      disabled={!!(Object.keys(errors).length)}
                      isLoading={isLoading}
                    />
                  }
                </DialogActions>

              </div>
            </Form>
          )
        }
        }
      </Formik >

    </Dialog >
  )

}

export default InitializeWellWizard
