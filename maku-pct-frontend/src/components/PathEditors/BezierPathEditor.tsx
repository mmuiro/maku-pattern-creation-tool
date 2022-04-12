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
import { BPParams, SVec2D } from '../../maku-classes/Pattern';
import Vec2D from '../../maku-classes/Vec2D';

interface BPEditorProps {
    params: BPParams;
    updater: Function;
    enabled: Boolean;
}

const BezierPathEditor: React.FC<any> = (props: BPEditorProps) => {
    const { params, updater, enabled } = props;
    let { pairs, controlPairs, idList } = params;
    const [points, pointsAS, controlPoints, controlPointsAS]: [
        Vec2D[],
        SVec2D[],
        Vec2D[],
        SVec2D[]
    ] = [[], [], [], []];
    for (let pair of pairs) {
        points.push(pair.point);
        pointsAS.push(pair.pointAS);
    }
    for (let pair of controlPairs) {
        controlPoints.push(pair.point);
        controlPointsAS.push(pair.pointAS);
    }
    const canRemove = params.pairs.length > 2;

    const createRemovePoint = (i: number) => (e: any) => {
        params.pairs.splice(i, 1);
        params.controlPairs.splice(i, 1);
        idList.splice(i, 1);
        updater();
    };

    const createHandleChangePointX =
        (i: number) => (vStr: string, vNum: number) => {
            points[i].x = vNum;
            pointsAS[i].x = vStr;
            updater();
        };

    const createHandleChangePointY =
        (i: number) => (vStr: string, vNum: number) => {
            points[i].y = vNum;
            pointsAS[i].y = vStr;
            updater();
        };

    const createHandleChangeControlPointX =
        (i: number) => (vStr: string, vNum: number) => {
            controlPoints[i].x = vNum;
            controlPointsAS[i].x = vStr;
            updater();
        };

    const createHandleChangeControlPointY =
        (i: number) => (vStr: string, vNum: number) => {
            controlPoints[i].y = vNum;
            controlPointsAS[i].y = vStr;
            updater();
        };

    const handleAddPair = () => {
        const lastPoint = points[points.length - 1];
        const lastCPoint = controlPoints[controlPoints.length - 1];
        params.pairs.push({
            point: lastPoint.copy(),
            pointAS: { x: String(lastPoint.x), y: String(lastPoint.y) },
        });
        params.controlPairs.push({
            point: lastCPoint.copy(),
            pointAS: { x: String(lastCPoint.x), y: String(lastCPoint.y) },
        });
        idList.push(Number(idList[idList.length - 1]) + 1);
        updater();
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
                    onChange={(vStr: string, vNum: number) => {
                        params.period = vNum;
                    }}
                    isDisabled={!enabled}
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
                    onChange={(vStr: string, vNum: number) => {
                        params.pause = vNum;
                    }}
                    isDisabled={!enabled}
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
                <React.Fragment key={params.idList[i]}>
                    <GridItem colStart={1} colSpan={1} pb={1}>
                        <FormLabel fontSize="sm">X{i}</FormLabel>
                        <NumberInput
                            size="sm"
                            variant="filled"
                            defaultValue={points[i].x}
                            onChange={createHandleChangePointX(i)}
                            value={pointsAS[i].x}
                            isDisabled={!enabled}
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
                            value={pointsAS[i].y}
                            isDisabled={!enabled}
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
                            value={controlPointsAS[i].x}
                            isDisabled={!enabled}
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
                            value={controlPointsAS[i].y}
                            isDisabled={!enabled}
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
                                isDisabled={!enabled}
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
                    isDisabled={!enabled}
                >
                    Add Point Pair
                </Button>
            </GridItem>
        </SimpleGrid>
    );
};

export default BezierPathEditor;
