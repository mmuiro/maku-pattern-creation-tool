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
}

const LinePathEditor: React.FC<any> = (props: LPEditorProps) => {
    const { params, rerenderer } = props;
    const points = params.points;

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
        rerenderer();
    };

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
            {params.points.map((point, i) => (
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
            <GridItem
                display="flex"
                justifyContent="end"
                colStart={2}
                colSpan={1}
            >
                <Button
                    variant="link"
                    onClick={handleAddPoint}
                    colorScheme="blue"
                >
                    Add Point
                </Button>
            </GridItem>
        </SimpleGrid>
    );
};

export default LinePathEditor;
