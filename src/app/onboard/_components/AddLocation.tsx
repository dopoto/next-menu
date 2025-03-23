'use client'

import { useActionState } from 'react'
import { mergeForm, useForm, useTransform } from '@tanstack/react-form'
import { initialFormState } from '@tanstack/react-form/nextjs'
import { useStore } from '@tanstack/react-store'
import { addLocationFormOptions } from '~/app/_domain/locations'
import someAction from '~/app/actions/onboardCreateCustomer'
import { Button } from '~/components/ui/button'
import { PriceTierId } from '~/app/_domain/price-tiers'
 
export const AddLocation = ({
  priceTierId,
  stripeSessionId,
  className,
}: {
  priceTierId: PriceTierId;
  stripeSessionId?: string;
  className?: string;
}) => {
  const [state, action] = useActionState(someAction, initialFormState)

  const form = useForm({
    ...addLocationFormOptions,
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, state ?? {}),
      [state],
    ),
  })

 
  const formErrors = useStore(form.store, (formState) => formState.errors)

  return (
    <form action={action as never} onSubmit={() => form.handleSubmit()}>
      {formErrors.map((error) => (
        <p key={error as unknown as string}>{error}</p>
      ))}

      <form.Field
        name="locationName"
        validators={{
          onSubmit: async ({ value }) => {
            // Do something with form data
            console.log(value)
            },
          onChange: ({ value }) =>
            value === 'y' ? 'Client validation: You must be at least 8' : undefined,
        }}
      >
        {(field) => {
          return (
            <div>
              <input
                name="locationName"                
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.errors.map((error) => (
                <p key={error as string}>{error?.toString()}</p>
              ))}
            </div>
          )
        }}
      </form.Field>
      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? '...' : 'Submit'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}