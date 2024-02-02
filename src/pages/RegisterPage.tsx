import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
        $nameFirst: String!
        $nameLast: String!
        $email: String!
        $password: String!
    ) {
        signup(nameFirst: $nameFirst, nameLast: $nameLast, email: $email, password: $password) {
            token
            user {
                id
                externalId
                nameFirst
                nameLast
                email
                status
                createdAt
                person {
                    externalId
                }
            }
            personExternalId
        }
    }
`

export const RegisterPage: React.FC = () => {
    const { setAuthUser, setAuthToken } = useAuth()
    const navigate = useNavigate()

    const [formState, setFormState] = useState({
        nameFirst: '',
        nameLast: '',
        email: '',
        password: '',
        cpassword: '',
    })

    const [nameFirstError] = React.useState('')
    const [nameLastError] = React.useState('')
    const [emailError] = React.useState('')
    const [passwordError, setPasswordError] = React.useState('')

    const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTATION, {
        variables: {
            nameFirst: formState.nameFirst,
            nameLast: formState.nameLast,
            email: formState.email,
            password: formState.password,
        },
        onCompleted: ({ signup }) => {
            // console.log('signup.onComplete, data: ', signup)
            if (signup.token && signup.user) {
                const authUser = {
                    ...signup.user,
                    personExternalId: signup.personExternalId ?? signup.user.person?.externalId,
                }
                setAuthUser(authUser)
                setAuthToken(signup.token)
                navigate('/')
            } else {
                console.log('Unexpected response: ', signup)
            }
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formState.password !== formState.cpassword) {
            setPasswordError('Passwords do not match')
            return false
        }
        signup()
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Create an account
                        </h1>

                        {loading && <div className="hidden">LOADING...</div>}

                        {data && <div className="hidden">SUCCESS!</div>}

                        {error && (
                            <div
                                className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                                role="alert"
                            >
                                <FontAwesomeIcon
                                    icon="circle-info"
                                    className="text-red-500 text-lg mr-2"
                                />
                                <span className="sr-only">Sign Up Failed</span>
                                <div>An Error occurred during sign up. ${error.message}</div>
                            </div>
                        )}

                        <form
                            className="space-y-4 md:space-y-6"
                            action="#"
                            method="post"
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <label
                                    htmlFor="name_first"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="name_first"
                                    id="name_first"
                                    value={formState.nameFirst}
                                    onChange={(e) =>
                                        setFormState({ ...formState, nameFirst: e.target.value })
                                    }
                                    placeholder=""
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                                {nameFirstError && (
                                    <p className="text-sm text-red-600">{nameFirstError}</p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="name_last"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="name_last"
                                    id="name_last"
                                    value={formState.nameLast}
                                    onChange={(e) =>
                                        setFormState({ ...formState, nameLast: e.target.value })
                                    }
                                    placeholder=""
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                                {nameLastError && (
                                    <p className="text-sm text-red-600">{nameLastError}</p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Your email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="new-email"
                                    id="email"
                                    value={formState.email}
                                    onChange={(e) =>
                                        setFormState({ ...formState, email: e.target.value })
                                    }
                                    placeholder="name@example.org"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                                {emailError && <p className="text-sm text-red-600">{emailError}</p>}
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    id="password"
                                    value={formState.password}
                                    onChange={(e) =>
                                        setFormState({ ...formState, password: e.target.value })
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                                {passwordError && (
                                    <p className="text-sm text-red-600">{passwordError}</p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="cpassword"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Confirm password
                                </label>
                                <input
                                    type="password"
                                    name="cpassword"
                                    id="cpassword"
                                    autoComplete="new-cpassword"
                                    value={formState.cpassword}
                                    onChange={(e) =>
                                        setFormState({ ...formState, cpassword: e.target.value })
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
                            >
                                SIGN UP
                            </button>

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                Already have an account?{' '}
                                <Link
                                    to="/"
                                    className="font-medium text-sky-600 hover:underline dark:text-sky-500 ml-2"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
