import calculationFns, { CalculationProps } from "../../../../../../../../pages/api/v1/modified-banking/[permitNumber]/[year]/calculate/calculationFns"

interface TestCase {
  description: string,
  props: CalculationProps,
  expected: number | undefined
}

describe('Modified banking calculation functions', () => {

  const fnKeys = Object.keys(calculationFns) as (keyof typeof calculationFns)[]

  fnKeys.forEach((key) => {
    describe('return user input value when dependencies are undefined', () => {
      it(key, () => {
        const props: CalculationProps = {
          data: {
            [key]: {
              value: 300,
              source: 'user'
            }
          }
        }

        const result = calculationFns[key](props)
        if (!result) throw new Error('result undefined')
        expect(result.value).toEqual(300)
        expect(result.source).toEqual('user')
      })
    })

    describe('return undefined if input is undefined', () => {
      it(key, () => {
        const props: CalculationProps = {
          data: {
            [key]: {
              value: undefined
            }
          }
        }

        const result = calculationFns[key](props)
        expect(result).toBeUndefined()
      })
    })

    describe('zero input returns zero', () => {
      it(key, () => {
        const props: CalculationProps = {
          data: {
            [key]: {
              value: 0
            }
          }
        }

        const result = calculationFns[key](props)
        if (!result) throw new Error('result undefined')
        expect(result.value).toEqual(0)
      })

    })

  })


  describe('return calculated value based on dependencies', () => {

    describe('originalAppropriation', () => {
      const propsArray: TestCase[] = [
        {
          description: 'dependencies exist',
          props: {
            data: {},
            dataLastYear: {
              originalAppropriation: {
                value: 300
              }
            }
          },
          expected: 300
        },
      ]

      propsArray.forEach(({ description, props, expected }) => {
        it(description, () => {

          const result = calculationFns['originalAppropriation'](props)
          if (!result) throw new Error('result undefined')
          expect(result.value).toEqual(expected)

        })
      })
    })

    describe('allowedAppropriation', () => {
      const propsArray: TestCase[] = [
        {
          description: 'dependencies exist',
          props: {
            data: {},
            dataLastYear: {
              allowedAppropriation: {
                value: 200
              }
            }
          },
          expected: 200
        }
      ]

      propsArray.forEach(({ description, props, expected }) => {
        it(description, () => {
          const result = calculationFns['allowedAppropriation'](props)
          if (!result) throw new Error('result undefined')
          expect(result.value).toEqual(expected)

        })
      })
    })

    describe('line3', () => {
      const propsArray: TestCase[] = [
        {
          description: 'dependencies exist',
          props: {
            data: {
              originalAppropriation: {
                value: 300
              },
              allowedAppropriation: {
                value: 200
              }
            },
          },
          expected: (300 - 200)
        }

      ]

      propsArray.forEach(({ description, props, expected }) => {
        it(description, () => {
          const result = calculationFns['line3'](props)
          if (!result) throw new Error('result undefined')
          expect(result.value).toEqual(expected)
        })
      })
    })

    describe('maxBankingReserve', () => {
      const propsArray: TestCase[] = [
        {
          description: 'reference originalAppropriation & allowedAppropriation (line 3 undefined)',
          props: {
            data: {
              originalAppropriation: {
                value: 300
              },
              allowedAppropriation: {
                value: 75
              },
            },
          },
          expected: (300 - 75) * 3
        },
        {
          description: 'reference line 3 (originalAppropriation & allowedAppropriation undefined)',
          props: {
            data: {
              line3: {
                value: 100
              }
            }
          },
          expected: 300
        },
        {
          description: 'reference line 3 (all dependencies defined)',
          props: {
            data: {
              originalAppropriation: {
                value: 300
              },
              allowedAppropriation: {
                value: 200
              },
              line3: {
                value: 100
              }
            }
          },
          expected: (300 - 200) * 3
        }

      ]

      propsArray.forEach(({ description, props, expected }) => {
        it(description, () => {
          const result = calculationFns['maxBankingReserve'](props)
          if (!result) throw new Error('result undefined')
          expect(result.value).toEqual(expected)
        })
      })


    })

    it('bankingReserveLastYear', () => {
      const props: CalculationProps = {
        data: {},
        bankingReserveLastYear: 120
      }

      const result = calculationFns['bankingReserveLastYear'](props)
      if (!result) throw new Error('result undefined')
      expect(result.value).toEqual(120)
    })


    describe('pumpingLimitThisYear', () => {
      const baseData = {
        originalAppropriation: {
          value: 300
        },
        allowedAppropriation: {
          value: 200
        },
        bankingReserveLastYear: {
          value: 50
        }
      }

      const propsArray: { description: string, props: CalculationProps, expected: number | undefined }[] = [
        {
          description: 'default option b undefined: allowedAppropriation + bankingReserveLastYear',
          props: {
            data: { ...baseData }
          },
          expected: 250
        },
        {
          description: 'option b: allowedAppropriation + bankingReserveLastYear',
          props: {
            data: {
              ...baseData,
              line6Option: 'b',
            },
          },
          expected: 250
        },
        {
          description: 'option b: originalAppropriation',
          props: {
            data: {
              ...baseData,
              originalAppropriation: {
                value: 100
              }
            }
          },
          expected: 100
        },
        {
          description: 'option a: equal to line 2 (allowedAppropriation)',
          props: {
            data: {
              ...baseData,
              line6Option: 'a'
            }
          },
          expected: 200
        },
      ]

      propsArray.forEach(({ description, props, expected }) => {
        it(description, () => {
          const result = calculationFns['pumpingLimitThisYear'](props)
          if (!result) throw new Error('result undefined')
          expect(result.value).toEqual(expected)
        })
      })
    })

    it('totalPumpedThisYear', () => {
      const props: CalculationProps = {
        data: {},
        totalPumpedThisYear: 125
      }

      const result = calculationFns['totalPumpedThisYear'](props)
      if (!result) throw new Error('result undefined')
      expect(result.value).toEqual(125)
    })

    it('changeInBankingReserveThisYear', () => {
      const props: CalculationProps = {
        data: {
          allowedAppropriation: {
            value: 100
          },
          totalPumpedThisYear: {
            value: 75
          }
        }
      }

      const result = calculationFns['changeInBankingReserveThisYear'](props)
      if (!result) throw new Error('result undefined')
      expect(result.value).toEqual(100 - 75)
    })

    describe('bankingReserveThisYear', () => {

      const propsArray: { description: string, props: CalculationProps, expected: number | undefined }[] = [
        {
          description: 'reference maxBankingReserve (bankingReserveLastYear & changeInBankingReserveThisYear undefeind)',
          props: {
            data: {
              maxBankingReserve: {
                value: 200
              },
            }
          },
          expected: 200
        },
        {
          description: 'reference bankingReserveLastYear & changeInBankingReserveThisYear (maxBankingReserve undefined)',
          props: {
            data: {
              bankingReserveLastYear: {
                value: 75
              },
              changeInBankingReserveThisYear: {
                value: 25
              }
            }
          },
          expected: 100
        },
        {
          description: 'reference bankingReserveLastYear & changeInBankingReserveThisYear',
          props: {
            data: {
              maxBankingReserve: {
                value: 200
              },
              bankingReserveLastYear: {
                value: 75
              },
              changeInBankingReserveThisYear: {
                value: 25
              }
            }
          },
          expected: 100
        },
        {
          description: 'reference maxBankingReserve',
          props: {
            data: {
              maxBankingReserve: {
                value: 20
              },
              bankingReserveLastYear: {
                value: 75
              },
              changeInBankingReserveThisYear: {
                value: 25
              }
            }
          },
          expected: 20
        },
      ]

      propsArray.forEach(({ description, props, expected }) => {
        it(description, () => {
          const result = calculationFns['bankingReserveThisYear'](props)
          if (!result) throw new Error('result undefined')
          expect(result.value).toEqual(expected)
        })

      })
    })


    it('line 10', () => {
      const props: CalculationProps = {
        data: {
          allowedAppropriation: {
            value: 200
          },
          bankingReserveThisYear: {
            value: 10
          }
        }
      }

      const result = calculationFns['line10'](props)
      if (!result) throw new Error('result undefined')
      expect(result.value).toEqual(210)
    })

    describe('pumpingLimitNextYear', () => {
      const propsArray: { description: string, props: CalculationProps, expected: number | undefined }[] = [
        {
          description: 'reference originalAppropriation (line 10 undefined)',
          props: {
            data: {
              originalAppropriation: {
                value: 300
              }
            }
          },
          expected: 300
        },
        {
          description: 'reference line 10 (originalAppropriation undefined)',
          props: {
            data: {
              line10: {
                value: 20
              }
            }
          },
          expected: 20
        },
        {
          description: 'reference originalAppropriation',
          props: {
            data: {
              originalAppropriation: {
                value: 20
              },
              line10: {
                value: 100
              }
            }
          },
          expected: 20
        },
        {
          description: 'reference originalAppropriation',
          props: {
            data: {
              originalAppropriation: {
                value: 300
              },
              line10: {
                value: 100
              }
            }
          },
          expected: 100
        },
      ]

      propsArray.forEach(({ description, props, expected }) => {
        it(description, () => {
          const result = calculationFns['pumpingLimitNextYear'](props)
          if (!result) throw new Error('result undefined')
          expect(result.value).toEqual(expected)
        })
      })
    })



  })



})
