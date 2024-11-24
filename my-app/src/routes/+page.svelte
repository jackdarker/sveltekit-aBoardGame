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
</style>
