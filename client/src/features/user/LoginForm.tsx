import React, { useContext } from 'react'
import { Form as FinalForm, Field } from 'react-final-form'
import { Form, Button, Label, Divider } from 'semantic-ui-react'
import TextInput from '../../app/common/form/TextInput'
import { RootStoreContext } from '../../app/stores/rootStore'
import { IUserFormValues } from '../../app/models/user'
import { FORM_ERROR } from 'final-form'
import { combineValidators, isRequired } from 'revalidate'

const validate = combineValidators({
  email: isRequired('Email'),
  password: isRequired('Password')
})

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext)
  const { login } = rootStore.userStore

  const finalFormSubmit = (values: IUserFormValues) => {
    return login(values).catch(error => ({
      [FORM_ERROR]: error
    }))
  }

  return (
    <FinalForm
      onSubmit={finalFormSubmit}
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        hasSubmitErrors,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit
      }) => (
        <Form onSubmit={handleSubmit}>
          <Field name='email' placeholder='Email' component={TextInput} />
          <Field
            name='password'
            placeholder='Password'
            type='password'
            component={TextInput}
          />
          {hasSubmitErrors && !dirtySinceLastSubmit && (
            <Label color='red' basic content={submitError.data.errors} />
          )}
          <Divider hidden />
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            positive
            content='Login'
          />
        </Form>
      )}
    />
  )
}

export default LoginForm
