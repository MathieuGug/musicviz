<script lang="ts">
    import { spring } from "svelte/motion";
    export let x: number, y: number;
    
    let active = spring({factor: 1});
</script>

