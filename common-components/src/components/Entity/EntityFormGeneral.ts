import { FormValidateInput } from "@mantine/form";


export interface RenderFieldsGeneralProps {
    setParentLoading: (loading: boolean) => void;
    primaryEntityId: string;
    entityId?: string; // Optional for Create, required for Edit
    isEditing: boolean;
}

export interface EntityFormGeneralProps<CreateOrEdit> {
    title: string;
    description?: string;
    validation: FormValidateInput<CreateOrEdit> | ((values: CreateOrEdit) => FormValidateInput<CreateOrEdit>);
    renderFields: (props: RenderFieldsGeneralProps) => React.ReactNode;
    primaryEntityId: string;
}