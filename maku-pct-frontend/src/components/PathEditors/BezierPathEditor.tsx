import {
    Button,
    FormLabel,
    GridItem,
    NumberInput,
    NumberInputField,
    SimpleGrid,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';
import { BPParams } from '../../maku-classes/Pattern';
import Vec2D from '../../maku-classes/Vec2D';

interface BPEditorProps {
    params: BPParams;
    rerenderer: Function;
}

const BezierPathEditor: React.FC<any> = (props: BPEditorProps) => {
    const { params, rerenderer } = props;
    const { points, controlPoints } = params;
    const canRemove = params.points.length > 2;

    const createRemovePoint = (i: number) => (e: any) => {
        points.splice(i, 1);
        controlPoints.splice(i, 1);
        rerenderer();
    };

    const createHandleChangePointX =
        (i: number) => (vStr: string, vNum: number) => {
            points[i].x = vNum;
        };

    const createHandleChangePointY =
        (i: number) => (vStr: string, vNum: number) => {
            points[i].y = vNum;
        };

    const createHandleChangeControlPointX =
        (i: number) => (vStr: string, vNum: number) => {
            controlPoints[i].x = vNum;
        };

    const createHandleChangeControlPointY =
        (i: number) => (vStr: string, vNum: number) => {
            controlPoints[i].y = vNum;
        };

    const handleAddPair = () => {
        const lastPoint = points[points.length - 1];
        const lastCPoint = controlPoints[controlPoints.length - 1];
        points.push(lastPoint.copy());
        controlPoints.push(lastCPoint.copy());
        rerenderer();
    };

    const colResponsive = (i: number, w: number, s: number = 1) =>
        useBreakpointValue({
            base: { colStart: 1, colSpan: w },
            md: { colStart: i, colSpan: s },
        })!;

    return (
        <SimpleGrid columns={4} columnGap={6} rowGap={1} w="full">
            <GridItem colStart={1} colSpan={2} pt={3}>
                <FormLabel fontSize="sm">Period</FormLabel>
                <NumberInput
                    size="sm"
                    variant="filled"
                    defaultValue={params.period}
                    onChange={(vStr: string, vNum: number) =>
                        (params.period = vNum)
                    }
                >
                    <NumberInputField />
                </NumberInput>
            </GridItem>
            <GridItem colStart={3} colSpan={2} pt={3}>
                <FormLabel fontSize="sm">Pause</FormLabel>
                <NumberInput
                    size="sm"
                    variant="filled"
                    defaultValue={params.pause}
                    onChange={(vStr: string, vNum: number) =>
                        (params.pause = vNum)
                    }
                >
                    <NumberInputField />
                </NumberInput>
            </GridItem>
            <GridItem {...colResponsive(1, 4, 2)} pt={3} pb={2}>
                <Text fontSize="sm" fontWeight="semibold">
                    Points
                </Text>
            </GridItem>
            <GridItem {...colResponsive(3, 4, 2)} pt={3} pb={2}>
                <Text fontSize="sm" fontWeight="semibold">
                    Control Points
                </Text>
            </GridItem>
            {points.map((_, i) => (
                <React.Fragment key={i}>
                    <GridItem colStart={1} colSpan={1} pb={1}>
                        <FormLabel fontSize="sm">X{i}</FormLabel>
                        <NumberInput
                            size="sm"
                            variant="filled"
                            defaultValue={points[i].x}
                            onChange={createHandleChangePointX(i)}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </GridItem>
                    <GridItem colStart={2} colSpan={1} pb={1}>
                        <FormLabel fontSize="sm">Y{i}</FormLabel>
                        <NumberInput
                            size="sm"
                            variant="filled"
                            defaultValue={points[i].y}
                            onChange={createHandleChangePointY(i)}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </GridItem>
                    <GridItem colStart={3} colSpan={1} pb={1}>
                        <FormLabel fontSize="sm">X{i}</FormLabel>
                        <NumberInput
                            size="sm"
                            variant="filled"
                            defaultValue={controlPoints[i].x}
                            onChange={createHandleChangeControlPointX(i)}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </GridItem>
                    <GridItem colStart={4} colSpan={1} pb={1}>
                        <FormLabel fontSize="sm">Y{i}</FormLabel>
                        <NumberInput
                            size="sm"
                            variant="filled"
                            defaultValue={controlPoints[i].y}
                            onChange={createHandleChangeControlPointY(i)}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </GridItem>
                    {canRemove && (
                        <GridItem
                            colSpan={4}
                            colStart={1}
                            display="flex"
                            justifyContent="end"
                        >
                            <Button
                                size="sm"
                                variant="link"
                                colorScheme="red"
                                onClick={createRemovePoint(i)}
                            >
                                Remove
                            </Button>
                        </GridItem>
                    )}
                </React.Fragment>
            ))}
            <GridItem
                display="flex"
                justifyContent="end"
                {...colResponsive(3, 4, 2)}
                pt={3}
            >
                <Button
                    variant="link"
                    onClick={handleAddPair}
                    colorScheme="blue"
                >
                    Add Point Pair
                </Button>
            </GridItem>
        </SimpleGrid>
    );
};

export default BezierPathEditor;
