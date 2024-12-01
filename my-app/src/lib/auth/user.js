//import { BASE_API_URI } from '$lib/shared/constants';
import { session } from '$lib/store/user';
import { get } from 'svelte/store';

export const getCSRF = () => {
	fetch(`api/csrf/`, {
		credentials: 'include'
	})
		.then((res) => {
			const csrfToken = res.headers.get('X-CSRFToken');
			if (csrfToken) {
				session.setCSRF(csrfToken);
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

export const getSession = () => {
	fetch(`api/session/`, {
		credentials: 'include'
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.isAuthenticated) {
				session.setIsAuthenticated(true);
			} else {
				session.setIsAuthenticated(false);
				getCSRF();
			}
		})
		.catch((err) => {
			console.log(err);
		});
};