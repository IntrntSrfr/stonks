import { ParentComponent } from "solid-js";

interface Props {
    header: string;
}

const Section: ParentComponent<Props> = (props) => {
    return (
        <div class="mt-5">
            <h2 class="text-2xl mb-3 relative inline-block after:absolute after:h-[1px] after:w-full after:bg-accent-100 after:left-2 after:bottom-[-2px]">
                {props.header}
            </h2>
            <div class="flex flex-col gap-2">
                {props.children}
            </div>
        </div>
    )
}

export default Section;
