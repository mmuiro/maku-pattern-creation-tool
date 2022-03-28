import {
    Button,
    FormLabel,
    GridItem,
    NumberInput,
    NumberInputField,
    SimpleGrid,
} from '@chakra-ui/react';
import React, { Fragment } from 'react';
import { LPParams } from '../../maku-classes/Pattern';
import Vec2D from '../../maku-classes/Vec2D';

interface LPEditorProps {
    params: LPParams;
    rerenderer: Function;
    enabled: Boolean;
}

const LinePathEditor: React.FC<any> = (props: LPEditorProps) => {
    const { params, rerenderer, enabled } = props;
    const { points, idList } = params;
    const canRemove = points.length > 2;

    const createRemovePoint = (i: number) => (e: any) => {
        points.splice(i, 1);
        idList.splice(i, 1);
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

    const handleAddPoint = () => {
        const lastPoint = points[points.length - 1];
        points.push(lastPoint.copy());
        idList.push(Number(idList[idList.length - 1]) + 1);
        rerenderer();
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
            {params.points.map((_, i) => (
                <React.Fragment key={idList[i]}>
                    <GridItem colStart={1} colSpan={1}>
                        <FormLabel fontSize="sm">X{i}</FormLabel>
                        <NumberInput
                            size="sm"
                            variant="filled"
                            defaultValue={points[i].x}
                            onChange={createHandleChangePointX(i)}
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
                            defaultValue={points[i].y}
                            onChange={createHandleChangePointY(i)}
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
