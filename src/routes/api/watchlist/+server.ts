import type { RequestHandler } from '@sveltejs/kit';
import { validateCategoryParam } from '$lib/server/validators/category.validator';
import { validatePaginationParams } from '$lib/server/validators/pagination.validator';
import { prisma } from '$lib/server/services/prisma.service';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
import { json } from '@sveltejs/kit';
import { excludeProperties } from '$lib/server/helpers/object.helper';

export const GET: RequestHandler = async ({ request, url }) => {
	const user = await getAuthenticatedUser(request);

	const search = url.searchParams.get('search') ?? undefined;
	const category = validateCategoryParam(url.searchParams.get('category'));
	const { perPage, page } = validatePaginationParams(Object.fromEntries(url.searchParams));

	const movies = await prisma.movie.findMany({
		take: perPage,
		skip: (page - 1) * perPage,
		where: {
			title: { contains: search, mode: 'insensitive' },
			category: { some: { id: { in: category ? [category] : undefined } } },
			Interested: { some: { userId: user.id } }
		},
		include: { category: true }
	});

	return json(
		movies.map((movie) => excludeProperties(movie, ['backdrop', 'duration', 'content', 'plot']))
	);
};
