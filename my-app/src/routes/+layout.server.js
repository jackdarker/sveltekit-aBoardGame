import * as auth from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';

export const load = async (event) => {
	/*if (event.locals.user) {
		return redirect(302, '/demo/lucia');
	}*/
	return { user: event.locals.user };
};
