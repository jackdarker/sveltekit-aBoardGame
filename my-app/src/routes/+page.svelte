<script>
	import '$lib/styles/style.svelte';
	import { Theme, Dropdown,Button, Tag,Form, TextInput, Search, Select, SelectItem } from "carbon-components-svelte";
	import SettingsSVG from "carbon-icons-svelte/lib/Settings.svelte";
    import HomeSVG from "carbon-icons-svelte/lib/Home.svelte";
    import LoginSVG from "carbon-icons-svelte/lib/Login.svelte";
    import LogoutSVG from "carbon-icons-svelte/lib/Logout.svelte";
	import { enhance } from '$app/forms';
	import Counter from './Counter.svelte';
	import welcome from '$lib/images/svelte-welcome.webp';
	import welcomeFallback from '$lib/images/svelte-welcome.png';
	import { goto } from '$app/navigation';
	//import { BASE_API_URI } from '$lib/shared/constants';
	import { session } from '$lib/store/user';

	let username, password, error;

	const currentYear = new Date().getFullYear();
	const handleLogin = () => {
		const headers = new Headers();
		headers.append('X-CSRFToken', $session.csrf);
		headers.append('Content-Type', 'application/json');
		fetch(`api/login/`, {
			method: 'POST',
			headers: headers,
			credentials: 'include',
			body: JSON.stringify({ username: username, password: password })
		})
			.then((res) => {
				if (!res.ok) {
					return res.text().then((text) => {
						error = text;
						console.error(text);
					});
				} else {
					return res.json();
				}
			})
			.then((data) => {
				$session.isAuthenticated = true;
				//$session.user.pk = data.user[0].pk;
				//$session.user.email = data.user[0].fields.email;
				$session.user.username = data.user.username;
				/*$session.user.first_name = data.user[0].fields.first_name;
				$session.user.last_name = data.user[0].fields.last_name;
				$session.user.last_login = data.user[0].fields.last_login;
				$session.user.is_active = data.user[0].fields.is_active;
				$session.user.is_staff = data.user[0].fields.is_staff;
				$session.user.is_superuser = data.user[0].fields.is_superuser;
				$session.user.date_joined = data.user[0].fields.date_joined;*/

				goto('/chat');
			})
			.catch((err) => {
				console.log(err);
				$session.error = 'Wrong username or password.';
			});
	};
	//import { source } from 'sveltekit-sse'
  //const value = source('/custom-event').select('message')			 {$value}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>
		<span class="welcome">
			<picture>
				<source srcset={welcome} type="image/webp" />
				<img src={welcomeFallback} alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app<br>
	</h1>
	<Counter />
	<h2>
		Setup the Game:
	</h2>
	<div class="myForm">
		<Form  method="POST" action="?/create">
			<label > enter playername:
				<TextInput inline="true" id="playername" labelText="Name" name="id" autocomplete="off"/>
				<input type="submit" />
			</label>
		</Form></div>

		<main class="form-signin">
			<form on:submit|preventDefault={handleLogin} method="POST">
				<h1 class="h3 mb-3 fw-normal text-center">Please sign in</h1>
				{#if error}
					<p class="text-danger text-center">{error}</p>
				{/if}
				<div class="form-floating">
					<input
						type="text"
						class="form-control"
						id="floatingInput"
						placeholder="Username"
						bind:value={username}
					/>
					<label for="floatingInput">Username</label>
				</div>
				<div class="form-floating">
					<input
						type="password"
						class="form-control"
						id="floatingPassword"
						bind:value={password}
						placeholder="Password"
					/>
					<label for="floatingPassword">Password</label>
				</div>
		
				<button class="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
				<p class="mt-5 mb-3 text-muted text-center">&copy; {currentYear}</p>
			</form>
		</main>
		
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}

			.form-signin {
				width: 100%;
				max-width: 330px;
				padding: 15px;
				margin: auto;
			}
		
			.form-signin .form-floating:focus-within {
				z-index: 2;
			}
		
			.form-signin input[type='text'] {
				margin-bottom: -1px;
				border-bottom-right-radius: 0;
				border-bottom-left-radius: 0;
			}
		
			.form-signin input[type='password'] {
				margin-bottom: 10px;
				border-top-left-radius: 0;
				border-top-right-radius: 0;
			}

</style>
