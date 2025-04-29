import BUTTON_TYPES from "../assets/ButtonTypes";

export default function TypeBadge({ typeName = "" }) {
	// Normalize and fall back to NORMAL if it's missing or unrecognized
	const key = typeName.toUpperCase();
	const color = BUTTON_TYPES[key] ?? BUTTON_TYPES.NORMAL;

	// If there's no real typeName, you can either render nothing or a default badge
	if (!typeName) return null;

	return (
		<span
			className="inline-block px-2 py-1 rounded text-white text-sm font-medium capitalize m-1"
			style={{ backgroundColor: color }}
		>
			{typeName}
		</span>
	);
}
