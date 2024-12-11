import { fail, redirect } from '@sveltejs/kit';

export const load = async (event) => {		//Note that layout-load is not re-executed on page reload!
	return { user: event.locals.user };	
};
