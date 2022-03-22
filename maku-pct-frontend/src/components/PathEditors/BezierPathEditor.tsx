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

    const colResponsive = (i: number, w: number) =>
        useBreakpointValue({
            base: { colStart: 1, colSpan: w },
            md: { colStart: i, colSpan: 1 },
        })!;

    return (
        <SimpleGrid columns={2} columnGap={6} rowGap={4} w="full">
            <GridItem colStart={1} colSpan={1}>
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
            <GridItem colStart={2} colSpan={1}>
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
            <GridItem {...colResponsive(1, 2)}>
                <FormLabel fontSize="sm">Points</FormLabel>
                <SimpleGrid columns={2} columnGap={6} rowGap={4}>
                    {points.map((point, i) => (
                        <React.Fragment key={i}>
                            <GridItem colStart={1} colSpan={1}>
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
                            <GridItem colStart={2} colSpan={1} key={i}>
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
                        </React.Fragment>
                    ))}
                </SimpleGrid>
            </GridItem>
            <GridItem {...colResponsive(2, 2)}>
                <FormLabel fontSize="sm">Control Points</FormLabel>
                <SimpleGrid columns={2} columnGap={6} rowGap={4}>
                    {controlPoints.map((point, i) => (
                        <React.Fragment key={i}>
                            <GridItem colStart={1} colSpan={1}>
                                <FormLabel fontSize="sm">X{i}</FormLabel>
                                <NumberInput
                                    size="sm"
                                    variant="filled"
                                    defaultValue={controlPoints[i].x}
                                    onChange={createHandleChangeControlPointX(
                                        i
                                    )}
                                >
                                    <NumberInputField />
                                </NumberInput>
                            </GridItem>
                            <GridItem colStart={2} colSpan={1} key={i}>
                                <FormLabel fontSize="sm">Y{i}</FormLabel>
                                <NumberInput
                                    size="sm"
                                    variant="filled"
                                    defaultValue={controlPoints[i].y}
                                    onChange={createHandleChangeControlPointY(
                                        i
                                    )}
                                >
                                    <NumberInputField />
                                </NumberInput>
                            </GridItem>
                        </React.Fragment>
                    ))}
                </SimpleGrid>
            </GridItem>
            <GridItem
                display="flex"
                justifyContent="end"
                colStart={2}
                colSpan={1}
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
