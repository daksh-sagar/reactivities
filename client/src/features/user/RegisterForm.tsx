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
  password: isRequired('Password'),
  displayName: isRequired('Display Name'),
  username: isRequired('Username')
})

const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext)
  const { register } = rootStore.userStore

  const finalFormSubmit = (values: IUserFormValues) => {
    return register(values).catch(error => ({
      [FORM_ERROR]: error
    }))
  }

  return (
    <FinalForm
      onSubmit={finalFormSubmit}
      // validate={validate}
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
          <Field name='username' placeholder='Username' component={TextInput} />
          <Field name='email' placeholder='Email' component={TextInput} />
          <Field
            name='displayName'
            placeholder='Display Name'
            component={TextInput}
          />
          <Field
            name='password'
            placeholder='Password'
            type='password'
            component={TextInput}
          />
          {hasSubmitErrors &&
            !dirtySinceLastSubmit &&
            Object.values(submitError.data.errors)
              .flat()
              .map((err, i) => (
                <Label color='red' basic key={i} content={err} />
              ))}
          <Divider hidden />
          <Button
            disabled={(invalid && !dirtySinceLastSubmit) || pristine}
            loading={submitting}
            color='teal'
            size='medium'
            content='Register'
          />
        </Form>
      )}
    />
  )
}

export default RegisterForm
