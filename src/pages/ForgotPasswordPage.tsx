import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ForgotPasswordPage: React.FC = () => {
	const [error] = React.useState(null);
	const [message] = React.useState(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		alert('Reset Password is Not implemented on Demo');
	};

	return (
		<section className="bg-gray-50 dark:bg-gray-900">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">

						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
							Forgot Password?
						</h1>
						{error && (
							<div
								className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
								role="alert">
								<FontAwesomeIcon icon="circle-info" className="text-red-500 text-lg mr-2" />
								<span className="sr-only">Error</span>
								<div>{error}</div>
							</div>
						)}

						{message && (
							<div
								className="flex p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
								role="alert">
								<FontAwesomeIcon icon="circle-check" className="text-green-500 text-lg mr-2" />
								<span className="sr-only">Success</span>
								<div>{message}</div>
							</div>
						)}

						<form
							className="space-y-4 md:space-y-6"
							action="#"
							method="post"
							onSubmit={handleSubmit}>
							<div>
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
									Email
								</label>
								<input
									type="email"
									name="email"
									id="email"
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
									placeholder=""
									required
								/>
							</div>

							<button
								type="submit"
								onClick={e => { e.preventDefault(); alert('Not Implemented for Demo'); }}
								className="w-full text-white bg-gray-400 hover:bg-gray-500 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800">
								SUBMIT
							</button>

							<p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
								<Link
									to="/"
									className="font-medium text-sky-600 hover:underline dark:text-sky-500">
									Return to Sign In
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}

export default ForgotPasswordPage