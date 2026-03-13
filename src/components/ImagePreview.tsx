import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog";

interface ImagePreviewProps {
	src: string;
	alt: string;
	className?: string;
}

export function ImagePreview({ src, alt, className }: ImagePreviewProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				{/* 点击触发预览的缩略图 */}
				<img
					src={src}
					alt={alt}
					className={`cursor-pointer rounded-md object-cover ${className}`}
				/>
			</DialogTrigger>

			<DialogContent className="max-w-5xl border-none bg-transparent p-0 shadow-none" aria-describedby={undefined}>
				{/* 预览的大图 */}
				<DialogTitle className="sr-only">{alt}</DialogTitle>
				<img
					src={src}
					alt={alt}
					className="h-full w-full rounded-md object-contain"
				/>
			</DialogContent>
		</Dialog>
	);
}
