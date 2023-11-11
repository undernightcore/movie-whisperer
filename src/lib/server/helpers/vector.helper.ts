import { PrismaVectorStore } from 'langchain/vectorstores/prisma';
import { HuggingFaceTransformersEmbeddings } from 'langchain/embeddings/hf_transformers';
import type { Movie } from '@prisma/client';
import { prisma } from '$lib/server/services/prisma.service';
import { Prisma } from '@prisma/client';

export function getVectorStore() {
	return PrismaVectorStore.withModel<Movie>(prisma).create(getEmbeddings(), {
		prisma: Prisma,
		tableName: 'Movie',
		vectorColumnName: 'vector',
		columns: {
			id: PrismaVectorStore.IdColumn,
			plot: PrismaVectorStore.ContentColumn
		}
	});
}

export function getEmbeddings() {
	return new HuggingFaceTransformersEmbeddings({
		modelName: 'Xenova/all-MiniLM-L6-v2'
	});
}
