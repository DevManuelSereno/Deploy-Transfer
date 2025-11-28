import * as z from "zod";

export const FileSchema = z.object({
	id: z.number().int(),
	fileName: z.string(),
	path: z.string(),
	mimeType: z.string(),
	size: z.number().int(),
	createdAt: z.date(),
});

export type FileType = z.infer<typeof FileSchema>;
