/* different svelte-stores used in client
 */
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createSettings() {
	let defaultSettings = {
		theme:"g80",
		animationSpeed: 'normal'
	};
	
	const { subscribe, set, update } = writable(defaultSettings);
	loadFromLocalStorage();
	/**
	 * @param {Settings} settings
	 */
	function saveToLocalStorage(settings) {
		const data = JSON.stringify(settings);
		try {
			window.localStorage.setItem('settings', data);
		} catch (error) {
			console.log('error while saving settings to local storage');
			console.error(error);
		}
	}

	function loadFromLocalStorage() {
		try {
			let data = null;
			if (browser){
				data = window.localStorage.getItem('settings');	//todo window might not exist yet
			}
			if (data === null) {
				set(defaultSettings);
			} else {
				const parsed = JSON.parse(data);
				set(Object.assign({}, defaultSettings, parsed));
			}
		} catch (error) {
			console.log('error while loading settings from local storage');
			console.error(error);
		}
	}

	/**
	 *
	 * @param {Settings} value
	 */
	function set_(value) {
		set(value);
		saveToLocalStorage(value);
	}

	return {
		subscribe,
		loadFromLocalStorage,
		set: set_
	};
}

export const settings = createSettings();