<script lang="ts">
  import type { PageProps } from './$types';
  import AcademicCalendar from '#lib/components/AcademicCalendar.svelte';
  import SeoHead from '#lib/components/SeoHead.svelte';
  import { ACADEMIC_CALENDAR_META } from '../../data/academic-calendar';

  const { data }: PageProps = $props();

  const canonicalUrl = $derived(new URL('/calendar', data.siteOrigin).href);
  const ogImageUrl = $derived(new URL('/og-image.png', data.siteOrigin).href);
</script>

<SeoHead
  title={`Academic Calendar (${ACADEMIC_CALENDAR_META.academicYear}) - Geary`}
  description="Searchable and filterable Bulacan State University Academic Calendar for AY 2026-2027 covering Undergraduate, Graduate School, Laboratory High School, College of Law, College of Medicine, and Holidays."
  {canonicalUrl}
  {ogImageUrl}
/>

<AcademicCalendar />
