import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'
import { useAuth } from '@/contexts/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { VITE_DEFAULT_EMAIL, VITE_DEFAULT_PASS } from '@/constants'

export const LOGIN_MUTATION = gql`
    mutation LoginMutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
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

export const LoginPage: React.FC = () => {
    const { setAuthUser, setAuthToken } = useAuth()
    const [formError] = useState('')
    const navigate = useNavigate()

    const [formState, setFormState] = useState({
        login: true,
        // email: '',
        // password: '',
        // Shortcut for Demo to fill in login form with credentials set in GraphQL server Seed data:
        email: VITE_DEFAULT_EMAIL,
        password: VITE_DEFAULT_PASS,
    })

    const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION, {
        variables: {
            email: formState.email,
            password: formState.password,
        },
        onCompleted: ({ login }) => {
            // console.log('login.onComplete, data: ', login);
            const authUser = {
                ...login.user,
            }
            setAuthUser(authUser)
            setAuthToken(login.token)
            navigate('/')
        },
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        login()
    }

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Sign in to your account
                        </h1>
                        {formError && (
                            <div
                                className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                                role="alert"
                            >
                                <FontAwesomeIcon
                                    icon="circle-info"
                                    className="text-red-500 text-lg mr-2"
                                />
                                <span className="sr-only">Error</span>
                                <div>{formError}</div>
                            </div>
                        )}

                        {loading && <div className="hidden">LOADING...</div>}

                        {data && <div className="hidden">LOGGED IN</div>}

                        {error && (
                            <div
                                className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                                role="alert"
                            >
                                <FontAwesomeIcon
                                    icon="circle-info"
                                    className="text-red-500 text-lg mr-2"
                                />
                                <span className="sr-only">Login Failed</span>
                                <div>
                                    Login Failed:{' '}
                                    {error.message.indexOf('NetworkError') !== -1
                                        ? 'Check Server connection'
                                        : error.message}
                                </div>
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
                                    htmlFor="email"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formState.email}
                                    onChange={(e) =>
                                        setFormState({ ...formState, email: e.target.value })
                                    }
                                    placeholder=""
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
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
                                    id="password"
                                    value={formState.password}
                                    onChange={(e) =>
                                        setFormState({ ...formState, password: e.target.value })
                                    }
                                    placeholder=""
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full text-white bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
                            >
                                SIGN IN
                            </button>

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                <Link
                                    to="/register"
                                    className="font-medium text-sky-600 hover:underline dark:text-sky-500"
                                >
                                    Create an account
                                </Link>
                                <span className="mx-3">|</span>
                                <Link
                                    to="/password/forgot"
                                    className="font-medium text-sky-600 hover:underline dark:text-sky-500"
                                >
                                    Forgot Password?
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
