import type { RequestHandler } from '@sveltejs/kit';
import { tmdb } from '$lib/server/services/tmdb.service';
import { prisma } from '$lib/server/services/prisma.service';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async () => {
	await processCategories();
	return json({ message: 'Surprising lol' });
};

async function processCategories() {
	const localCategories = await prisma.category
		.findMany()
		.then((categories) => categories.map((category) => category.id));

	const remoteCategories = await tmdb
		.getCategories()
		.then((categories) =>
			categories
				.filter((category) => !localCategories.includes(category.id))
				.map(({ id, name }) => ({ id, title: name }))
		);

	await prisma.category.createMany({ data: remoteCategories });
}
