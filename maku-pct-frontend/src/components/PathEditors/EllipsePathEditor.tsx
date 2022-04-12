import {
    FormLabel,
    GridItem,
    NumberInput,
    SimpleGrid,
    NumberInputField,
    VStack,
    RadioGroup,
    Radio,
    Stack,
} from '@chakra-ui/react';
import { BsArrowClockwise, BsArrowCounterclockwise } from 'react-icons/bs';
import React from 'react';
import { EPParams } from '../../maku-classes/Pattern';

interface EPEditorProps {
    params: EPParams;
    updater: Function;
    enabled: Boolean;
}

const EllipsePathEditor: React.FC<any> = (props: EPEditorProps) => {
    const { params, enabled } = props;
    return (
        <SimpleGrid columns={2} columnGap={6} rowGap={4} w="full">
            <GridItem colStart={1} colSpan={1}>
                <FormLabel fontSize="sm">Center X</FormLabel>
                <NumberInput
                    size="sm"
                    colorScheme="blue"
                    variant="filled"
                    onChange={(vString, vNum) => (params.centerX = vNum)}
                    defaultValue={params.centerX}
                    isDisabled={!enabled}
                >
                    <NumberInputField />
                </NumberInput>
            </GridItem>
            <GridItem colStart={2} colSpan={1}>
                <FormLabel fontSize="sm">Center Y</FormLabel>
                <NumberInput
                    size="sm"
                    colorScheme="blue"
                    variant="filled"
                    onChange={(vString, vNum) => (params.centerY = vNum)}
                    defaultValue={params.centerY}
                    isDisabled={!enabled}
                >
                    <NumberInputField />
                </NumberInput>
            </GridItem>
            <GridItem colStart={1} colSpan={1}>
                <FormLabel fontSize="sm">X-Axis</FormLabel>
                <NumberInput
                    size="sm"
                    colorScheme="blue"
                    variant="filled"
                    onChange={(vString, vNum) => (params.xAxis = vNum)}
                    defaultValue={params.xAxis}
                    isDisabled={!enabled}
                >
                    <NumberInputField />
                </NumberInput>
            </GridItem>
            <GridItem colStart={2} colSpan={1}>
                <FormLabel fontSize="sm">Y-Axis</FormLabel>
                <NumberInput
                    size="sm"
                    colorScheme="blue"
                    variant="filled"
                    onChange={(vString, vNum) => (params.yAxis = vNum)}
                    defaultValue={params.yAxis}
                    isDisabled={!enabled}
                >
                    <NumberInputField />
                </NumberInput>
            </GridItem>
            <GridItem colStart={1} colSpan={1}>
                <FormLabel fontSize="sm">Period</FormLabel>
                <NumberInput
                    size="sm"
                    colorScheme="blue"
                    variant="filled"
                    onChange={(vString, vNum) => (params.period = vNum)}
                    defaultValue={params.period}
                    isDisabled={!enabled}
                >
                    <NumberInputField />
                </NumberInput>
            </GridItem>
            <GridItem colStart={2} colSpan={1}>
                <FormLabel fontSize="sm">Pause</FormLabel>
                <NumberInput
                    size="sm"
                    colorScheme="blue"
                    variant="filled"
                    onChange={(vString, vNum) => (params.pause = vNum)}
                    defaultValue={params.pause}
                    isDisabled={!enabled}
                >
                    <NumberInputField />
                </NumberInput>
            </GridItem>
            <GridItem colStart={1} colSpan={1}>
                <RadioGroup
                    alignItems="start"
                    w="full"
                    defaultValue={1}
                    value={params.direction}
                    onChange={(value) => {
                        params.direction = parseInt(value);
                        props.updater();
                    }}
                    isDisabled={!enabled}
                >
                    <FormLabel fontSize="sm">Rotation Direction</FormLabel>
                    <Stack direction="row" spacing={6}>
                        <Radio value={1}>
                            <BsArrowClockwise />
                        </Radio>
                        <Radio value={-1}>
                            <BsArrowCounterclockwise />
                        </Radio>
                    </Stack>
                </RadioGroup>
            </GridItem>
        </SimpleGrid>
    );
};

export default EllipsePathEditor;
