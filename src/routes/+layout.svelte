<script>
	import './styles.css';

	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { webVitals } from '$lib/vitals';

	import { onMount } from 'svelte';
	import { screenType, isIframe, screenSize } from '$lib/store/store';
	import { getDeviceType, getScreenSize } from '$lib/functions/utils';

	export let data;
	let Geometry;

	$: if (browser && data?.analyticsId) {
		webVitals({
			path: $page.url.pathname,
			params: $page.params,
			analyticsId: data.analyticsId
		});
	}

	function handleScreen() {
		// screen size
		screenSize.set(getScreenSize());

		// device type
		screenType.set(getDeviceType());
		isIframe.set(window.location !== window.parent.location);
	}

	let showShader = false;
	let showEpilepsyWarning = true;
	let showCompletionMessage = false;
	const epilepsyTestDuration = 4000; // 5 seconds

	const handleKeyPress = (event) => {
		if (event.key === ' ') {
			if (showEpilepsyWarning) {
				startEpilepsyTest();
			} else if (showCompletionMessage) {
				repeatEpilepsyTest();
			}
		}
	};

	const startEpilepsyTest = () => {
		showEpilepsyWarning = false;
		showShader = true;
		setTimeout(() => {
			showShader = false;
			showCompletionMessage = true;
		}, epilepsyTestDuration);
	};

	const repeatEpilepsyTest = () => {
		showCompletionMessage = false;
		startEpilepsyTest();
	};

	onMount(async () => {
		// webgl
		const module = await import('$lib/graphics/webgl.svelte');
		Geometry = module.default;

		handleScreen();
		window.addEventListener('resize', () => handleScreen());

		window.addEventListener('keydown', handleKeyPress);

		return () => {
			window.removeEventListener('resize', () => handleScreen());
			window.removeEventListener('keydown', handleKeyPress);
		};
	});
</script>

<svelte:head>
	<title>do-you-have-epilepsy.com</title>
	<meta name="description" content="DO NOT USE IF YOU ACTUALLY HAVE EPILEPSY" />
	<meta name="keywords" content="" />
	<meta name="author" content="AUFBAU" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />

	<link rel="preload" href="/aufbau.svg" as="image" type="image/svg+xml" crossorigin="anonymous" />
</svelte:head>

{#if showEpilepsyWarning}
	<div class="epilepsy-warning">
		<i>www.do-you-have-epilepsy.com</i>
		<br />
		<br />
		Press <b>spacebar</b> to start epilepsy test
		<br />
		<br />
		<b class="important">VERY IMPORTANT DISCLAIMER:<br />DO NOT USE IF YOU ACTUALLY HAVE EPILEPSY</b
		>
	</div>
{:else if showShader}
	<svelte:component this={Geometry} />
{:else if showCompletionMessage}
	<div class="completion-message">
		<b>!! Congratulations. !!</b>
		<br /><br />
		If you made it here,<br />you do not have epilepsy.
		<br /><br />
		Press <b>spacebar</b> to repeat the test
	</div>
{/if}

<style>
	.app {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100dvh;
		max-height: 100vh;
		width: 100%;
		overflow: hidden;
		background: black;
	}

	.loading {
		position: absolute;
		font-style: italic;
		font-family: serif;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 10px;
		font-size: 12px;
	}

	.epilepsy-warning,
	.completion-message {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		font-size: 16px;
		padding: 20px;
		background-color: white;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		color: black;
	}

	b {
		font-weight: bold;
		color: black;
	}

	i {
		font-style: italic;
		font-weight: bold;
		color: black;
		/* text-decoration: underline 1px rgba(0, 0, 0, 1);
		text-underline-offset: 4px; */
	}

	b.important {
		text-decoration: underline 1px rgba(0, 0, 0, 1);
		text-underline-offset: 4px;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		width: 100%;
		height: 100%;
	}
</style>
