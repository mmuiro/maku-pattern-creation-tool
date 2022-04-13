import {
    Button,
    FormLabel,
    GridItem,
    NumberInput,
    NumberInputField,
    SimpleGrid,
} from '@chakra-ui/react';
import React, { Fragment } from 'react';
import { LPParams, SVec2D } from '../../maku-classes/Pattern';
import Vec2D from '../../maku-classes/Vec2D';

interface LPEditorProps {
    params: LPParams;
    updater: Function;
    enabled: Boolean;
}

const LinePathEditor: React.FC<any> = (props: LPEditorProps) => {
    const { params, updater, enabled } = props;
    const { pairs, idList } = params;
    const [points, pointsAS]: [Vec2D[], SVec2D[]] = [[], []];
    for (let pair of pairs) {
        points.push(pair.point);
        pointsAS.push(pair.pointAS);
    }
    const canRemove = points.length > 2;

    const createRemovePoint = (i: number) => (e: any) => {
        params.pairs.splice(i, 1);
        idList.splice(i, 1);
        updater();
    };
    const createHandleChangePointX =
        (i: number) => (vStr: string, vNum: number) => {
            points[i].x = vNum;
            updater();
        };

    const createHandleChangePointY =
        (i: number) => (vStr: string, vNum: number) => {
            points[i].y = vNum;
            updater();
        };

    const handleAddPoint = () => {
        const lastPoint = points[points.length - 1];
        params.pairs.push({
            point: lastPoint.copy(),
            pointAS: { x: String(lastPoint.x), y: String(lastPoint.y) },
        });
        idList.push(Number(idList[idList.length - 1]) + 1);
        updater();
    };

    return (
        <SimpleGrid columns={2} columnGap={6} rowGap={1} w="full">
            <GridItem colStart={1} colSpan={1} pb={3}>
                <FormLabel fontSize="sm">Period</FormLabel>
                <NumberInput
                    size="sm"
                    variant="filled"
                    defaultValue={params.period}
                    onChange={(vStr: string, vNum: number) =>
                        (params.period = vNum)
                    }
                    isDisabled={!enabled}
                >
                    <NumberInputField />
                </NumberInput>
            </GridItem>
            <GridItem colStart={2} colSpan={1} pb={3}>
                <FormLabel fontSize="sm">Pause</FormLabel>
                <NumberInput
                    size="sm"
                    variant="filled"
                    defaultValue={params.pause}
                    onChange={(vStr: string, vNum: number) =>
                        (params.pause = vNum)
                    }
                    isDisabled={!enabled}
                >
                    <NumberInputField />
                </NumberInput>
            </GridItem>
            <GridItem colStart={1} colSpan={2}>
                <FormLabel fontSize="sm">Points</FormLabel>
            </GridItem>
            {points.map((_, i) => (
                <React.Fragment key={idList[i]}>
                    <GridItem colStart={1} colSpan={1}>
                        <FormLabel fontSize="sm">X{i}</FormLabel>
                        <NumberInput
                            size="sm"
                            variant="filled"
                            onChange={createHandleChangePointX(i)}
                            value={pointsAS[i].x}
                            isDisabled={!enabled}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </GridItem>
                    <GridItem colStart={2} colSpan={1} key={i}>
                        <FormLabel fontSize="sm">Y{i}</FormLabel>
                        <NumberInput
                            size="sm"
                            variant="filled"
                            onChange={createHandleChangePointY(i)}
                            value={pointsAS[i].y}
                            isDisabled={!enabled}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </GridItem>
                    {canRemove && (
                        <GridItem
                            colSpan={2}
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
                colStart={2}
                colSpan={1}
                pt={3}
            >
                <Button
                    variant="link"
                    onClick={handleAddPoint}
                    colorScheme="blue"
                    isDisabled={!enabled}
                >
                    Add Point
                </Button>
            </GridItem>
        </SimpleGrid>
    );
};

export default LinePathEditor;
