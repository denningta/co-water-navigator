import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Step, StepButton, Stepper, useMediaQuery, useTheme } from "@mui/material"
import { Field, Form, Formik, FormikErrors, FormikHelpers, FormikValues } from "formik"
import { useEffect, useState } from "react"
import { FaCheck } from "react-icons/fa"
import Button from "./Button"
import * as Yup from 'yup'
import { IoClose } from "react-icons/io5"
import axios from "axios"
import { ModifiedBanking } from "../../interfaces/ModifiedBanking"

const steps = [
  {
    label: 'Starting Year',
    fields: ['year']
  },
  {
    label: 'Allowed Appropriation',
    fields: ['originalAppropriation', 'allowedAppropriation', 'bankingReserveLastYear']
  },
  {
    label: 'Pumping Limit',
    fields: ['pumpingLimitLastYear']
  },
]

const getInitialValues = (permitNumber: string | undefined, year: string | undefined) => {
  return {
    permitNumber: permitNumber ?? '',
    year: year ?? '',
    originalAppropriation: '',
    allowedAppropriation: '',
    bankingReserveLastYear: '',
    pumpingLimitNextYear: ''
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
    .typeError('Enter a valid 4 digit year'),
  allowedAppropriation: Yup.number()
    .required('Required')
    .typeError('Enter a valid 4 digit year'),
  bankingReserveLastYear: Yup.number()
    .required('Required')
    .typeError('Enter a valid 4 digit year'),
  pumpingLimitNextYear: Yup.number()
    .required('Required')
    .typeError('Enter a valid 4 digit year')
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
    return steps.length
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
    const errorFields = Object.keys(errors).filter(value => steps[activeStep].fields?.includes(value))
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
        ? steps.findIndex((step, i) => !(i in completed))
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
        {({ values, errors, touched }) => (

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
                  {steps.map(({ label }, index) => (
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
                    <div>
                      Enter the following data from the
                      <span className="font-extrabold text-xl"> {values.year && (+values.year)} DBB-013 </span>
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
                      <div>Line 5: Amount in banking reserve at the end of {values.year ? 'in ' + (+values.year - 1) : 'last year'}</div>
                      {values.year && <div className="text-sm text-gray-500">(Or line 9 of the {+values.year - 1} report)</div>}
                      <div className="flex items-center space-x-4">
                        <Field
                          id={'bankingReserveLastYear'}
                          name={'bankingReserveLastYear'}
                          className={`${inputClass} mt-2 min-w-[300px] md:min-w-[400px]`}
                          placeholder={`Acre-feet in banking reserve ${values.year ? 'in ' + (+values.year - 1) : 'last year'}`}
                        />
                        {values.bankingReserveLastYear && !errors.bankingReserveLastYear && <FaCheck className="text-success-600" />}
                      </div>
                      <div className="h-[20px] text-error-500 text-sm">
                        {errors.bankingReserveLastYear && touched.bankingReserveLastYear &&
                          errors.bankingReserveLastYear
                        }
                      </div>
                    </div>
                  </div>

                }

                {activeStep === 2 &&
                  <div className="space-y-8">
                    <div>
                      Enter the following data from the
                      <span className="font-extrabold text-xl"> {values.year ? (+values.year - 1) : 'last year'} DBB-013 </span>
                      form for this well.
                    </div>                  <div>
                      <div>Line 11: Pumping limit for {values.year ? (+values.year) : 'this year'}</div>
                      <div className="flex items-center space-x-4">
                        <Field
                          id={'pumpingLimitNextYear'}
                          name={'pumpingLimitNextYear'}
                          className={`${inputClass} mt-2 min-w-[300px] md:min-w-[400px]`}
                          placeholder={`Pumping limit for ${values.year ? (+values.year) : 'this year'}`}
                        />
                        {values.pumpingLimitNextYear && !errors.pumpingLimitNextYear && <FaCheck className="text-success-600" />}
                      </div>
                      <div className="h-[20px] text-error-500 text-sm">
                        {errors.pumpingLimitNextYear && touched.pumpingLimitNextYear &&
                          errors.pumpingLimitNextYear
                        }
                      </div>
                    </div>
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
        )}
      </Formik >

    </Dialog >
  )

}

export default InitializeWellWizard
