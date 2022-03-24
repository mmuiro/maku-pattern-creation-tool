import {
    BPParams,
    DEFAULTS,
    EPParams,
    LPParams,
    PathParams,
    pathType,
    PatternArgs,
} from '../maku-classes/Pattern';
import React, { useCallback, useState } from 'react';
import Path from '../maku-classes/Path';
import ColorPicker from './ColorPicker';
import Color from '../maku-classes/Color';
import { BooleanMap } from '../views/EditorPage';
import {
    GridItem,
    VStack,
    Text,
    NumberInput,
    NumberInputField,
    SimpleGrid,
    FormLabel,
    useBreakpointValue,
    Checkbox,
    Flex,
    Stack,
    Radio,
    RadioGroup,
    Button,
} from '@chakra-ui/react';
import { CgRemove } from 'react-icons/cg';

import EllipsePathEditor from './PathEditors/EllipsePathEditor';
import LinePathEditor from './PathEditors/LinePathEditor';
import BezierPathEditor from './PathEditors/BezierPathEditor';
import Vec2D from '../maku-classes/Vec2D';

const PARAM_TO_LABEL: { [key: string]: string } = {
    startDelay: 'Start Delay',
    fireInterval: 'Firing Interval',
    duration: 'Duration',
    initAngle: 'Starting Angle',
    initX: 'Initial X',
    initY: 'Initial Y',
    rotationSpeed: 'Rotation Speed',
    spreadAngle: 'Spread Angle',
    reverseRotPeriod: 'Reversal Period',
    bulletLowerSpeed: 'Lower Speed',
    bulletUpperSpeed: 'Upper Speed',
    bulletAccel: 'Acceleration',
    bulletMaxSpeed: 'Max Speed',
    bulletMinSpeed: 'Min Speed',
    bulletLifeSpan: 'Decay Time',
    bulletLowerRotSpeed: 'Lower Rotation Speed',
    bulletUpperRotSpeed: 'Upper Rotation Speed',
    bulletMaxAngleChange: 'Max Angle Change',
    smoothReversing: 'Smooth Reversing',
    stackLength: 'Burst Length',
    spokeCount: 'Spoke Count',
    bulletRadius: 'Radius',
};
const TIMING_PARAMS = ['startDelay', 'fireInterval'];
const SOURCE_INIT_PARAMS = ['initAngle', 'initX', 'initY'];
const SOURCE_ROT_PARAMS = ['rotationSpeed', 'spreadAngle'];
const COUNT_PARAMS = ['spokeCount', 'stackLength'];
const BULLET_MOTION_PARAMS = [
    'bulletLowerSpeed',
    'bulletUpperSpeed',
    'bulletAccel',
];

const BULLET_LIMIT_PARAMS = [
    'bulletMaxSpeed',
    'bulletMinSpeed',
    'bulletLifeSpan',
];
const BULLET_ROT_PARAMS = ['bulletLowerRotSpeed', 'bulletUpperRotSpeed'];

const PATH_TYPES: pathType[] = [
    pathType.None,
    pathType.Ellipse,
    pathType.Line,
    pathType.Bezier,
];

const PATH_TYPE_TO_PARAM: { [key: string]: string } = {
    Ellipse: 'EPParams',
    Line: 'LPParams',
    Bezier: 'BPParams',
};

export interface GridParams {
    colStart: number;
    colSpan: number;
}

interface PatternEditorArgs {
    patternParams: PatternArgs;
    preFreezeParams: PatternArgs;
    checkedParams: BooleanMap;
    rerenderer: Function;
    colorSetter: Function;
    DCP: Boolean;
    setDCP: Function;
    removeSelf: Function;
    title: string;
    canRemove: Boolean;
}

interface PathParamKeeper {
    EPParams: EPParams;
    LPParams: LPParams;
    BPParams: BPParams;
    [key: string]: EPParams | LPParams | BPParams;
}

export interface ColorProps {
    r: number;
    g: number;
    b: number;
    a: number;
}

export const PatternEditor: React.FC<any> = (props: PatternEditorArgs) => {
    const {
        patternParams,
        checkedParams,
        preFreezeParams,
        rerenderer,
        colorSetter,
        DCP,
        setDCP,
        removeSelf,
        title,
        canRemove,
    } = props;

    const defaultPathParams: PathParamKeeper = {
        EPParams: {
            centerX: patternParams.initX,
            centerY: patternParams.initY,
            xAxis: 100,
            yAxis: 100,
            pause: 0,
            period: 60,
            direction: 1,
        },
        LPParams: {
            points: [
                new Vec2D(patternParams.initX, patternParams.initY),
                new Vec2D(patternParams.initX, patternParams.initY),
            ],
            pause: 0,
            period: 60,
        },
        BPParams: {
            points: [
                new Vec2D(patternParams.initX, patternParams.initY),
                new Vec2D(patternParams.initX, patternParams.initY),
            ],
            controlPoints: [
                new Vec2D(patternParams.initX, patternParams.initY),
                new Vec2D(patternParams.initX, patternParams.initY),
            ],
            pause: 0,
            period: 60,
        },
    };

    const colResponsive = (i: number, w: number) =>
        useBreakpointValue({
            base: { colStart: 0, colSpan: w },
            md: { colStart: i, colSpan: 1 },
        })!;

    const createNumericInputElement = (
        param: string,
        min: number,
        max: number,
        gridInfo: GridParams,
        key: number = 1,
        angle: Boolean = false,
        toggleable: Boolean = false,
        dependentParam: string = ''
    ) => {
        const updateParam = (val: number) => {
            patternParams[param] = val;
            preFreezeParams[param] = val;
        };
        let isInvalid = toggleable && !checkedParams[param];
        let disabledByExternal =
            checkedParams.hasOwnProperty(dependentParam) &&
            !checkedParams[dependentParam];
        if (disabledByExternal) patternParams[param] = DEFAULTS[param];
        else if (checkedParams.hasOwnProperty(dependentParam))
            patternParams[param] = preFreezeParams[param];
        return (
            <GridItem
                colStart={gridInfo.colStart}
                colSpan={gridInfo.colSpan}
                key={key}
                w="full"
                alignSelf="flex-end"
            >
                <Flex
                    alignItems="center"
                    pt={1}
                    pr={1}
                    justifyContent="space-between"
                >
                    <FormLabel fontSize="sm">
                        {PARAM_TO_LABEL[param] + (angle ? ' °' : '')}
                    </FormLabel>
                    {toggleable && (
                        <Checkbox
                            size="md"
                            mb={0.5}
                            isChecked={false || Boolean(checkedParams[param]!)}
                            onChange={(e) => {
                                checkedParams[param] = e.target.checked;
                                if (!e.target.checked) {
                                    patternParams[param] = DEFAULTS[param];
                                } else {
                                    patternParams[param] =
                                        preFreezeParams[param];
                                }
                                rerenderer();
                            }}
                        ></Checkbox>
                    )}
                </Flex>
                <NumberInput
                    size="sm"
                    onChange={(valStr: string, valNum: number) => {
                        updateParam(valNum);
                        rerenderer();
                    }}
                    min={min}
                    max={max}
                    colorScheme="blue"
                    variant="filled"
                    isDisabled={isInvalid || Boolean(disabledByExternal!)} // TypeScript moment ????
                    defaultValue={String(patternParams[param] as number)}
                >
                    <NumberInputField />
                </NumberInput>
            </GridItem>
        );
    };

    const createSwitchElement = (
        param: string,
        gridInfo: GridParams,
        key: number = 1,
        dependentParam: string = ''
    ) => {
        let disabledByExternal =
            checkedParams.hasOwnProperty(dependentParam) &&
            !checkedParams[dependentParam];
        return (
            <GridItem
                colStart={gridInfo.colStart}
                colSpan={gridInfo.colSpan}
                key={key}
                w="full"
                alignSelf="flex-end"
            >
                <FormLabel fontSize="sm">
                    {PARAM_TO_LABEL.hasOwnProperty(param)
                        ? PARAM_TO_LABEL[param]
                        : param}
                </FormLabel>
                <Checkbox
                    isChecked={false || Boolean(checkedParams[param]!)}
                    onChange={(e) => {
                        console.log(checkedParams[param]);
                        checkedParams[param] = e.target.checked;
                        if (patternParams.hasOwnProperty(param)) {
                            patternParams[param] = e.target.checked;
                        }
                        rerenderer();
                    }}
                    isDisabled={Boolean(disabledByExternal)}
                    size="lg"
                >
                    <Text fontSize="sm">Enabled</Text>
                </Checkbox>
                <Text fontSize="md" fontWeight="semibold"></Text>
            </GridItem>
        );
    };

    const pathTypeToEditor = {
        None: <></>,
        Ellipse: (
            <EllipsePathEditor
                params={patternParams.EPParams}
                rerenderer={rerenderer}
            ></EllipsePathEditor>
        ),
        Line: (
            <LinePathEditor
                params={patternParams.LPParams}
                rerenderer={rerenderer}
            ></LinePathEditor>
        ),
        Bezier: (
            <BezierPathEditor
                params={patternParams.BPParams}
                rerenderer={rerenderer}
            ></BezierPathEditor>
        ),
    };

    return (
        <VStack spacing={4} justifyContent="flex-start">
            <Flex justifyContent="space-between" w="full">
                <Text color="blue.400" fontSize="2xl" fontWeight="semibold">
                    {title}
                </Text>
                {canRemove ? (
                    <Button
                        colorScheme="red"
                        size="sm"
                        variant="ghost"
                        leftIcon={<CgRemove />}
                        onClick={(e) => removeSelf(e)}
                    >
                        Remove
                    </Button>
                ) : (
                    <></>
                )}
            </Flex>
            {/* Timing Parameters */}
            <VStack spacing={1} alignItems="flex-start" w="full">
                <Text fontSize="xl" color="blue.400" fontWeight="semibold">
                    Timing
                </Text>
                <SimpleGrid columnGap={6} columns={3} w="full">
                    {TIMING_PARAMS.map((param, i) =>
                        createNumericInputElement(
                            param,
                            0,
                            Infinity,
                            colResponsive(i + 1, 3),
                            i
                        )
                    )}
                    {createNumericInputElement(
                        'duration',
                        0,
                        Infinity,
                        colResponsive(3, 3),
                        2,
                        false,
                        true
                    )}
                </SimpleGrid>
            </VStack>

            {/* Bullet Source Parameters */}
            <VStack spacing={2} alignItems="flex-start" w="full">
                <Text fontSize="xl" color="blue.400" fontWeight="semibold">
                    Bullet Source
                </Text>
                <SimpleGrid columnGap={6} columns={3} rowGap={4} w="full">
                    {SOURCE_INIT_PARAMS.map((param, i) =>
                        createNumericInputElement(
                            param,
                            -Infinity,
                            Infinity,
                            colResponsive(i + 1, 3),
                            i
                        )
                    )}
                </SimpleGrid>
                <SimpleGrid columnGap={6} columns={2} rowGap={2} w="full">
                    {SOURCE_ROT_PARAMS.map((param, i) =>
                        createNumericInputElement(
                            param,
                            -360,
                            360,
                            colResponsive(i + 1, 2),
                            i,
                            true
                        )
                    )}
                </SimpleGrid>
                <SimpleGrid columnGap={6} columns={3} rowGap={4} w="full">
                    {createSwitchElement(
                        'Rotation Reversing',
                        colResponsive(1, 3)
                    )}
                    {createSwitchElement(
                        'smoothReversing',
                        colResponsive(2, 3),
                        2,
                        'Rotation Reversing'
                    )}
                    {createNumericInputElement(
                        'reverseRotPeriod',
                        0,
                        Infinity,
                        colResponsive(3, 3),
                        3,
                        false,
                        false,
                        'Rotation Reversing'
                    )}
                </SimpleGrid>
            </VStack>

            {/* Burst/Spread Parameters */}
            <VStack spacing={1} alignItems="flex-start" w="full">
                <Text fontSize="xl" color="blue.400" fontWeight="semibold">
                    Bursts/Spread
                </Text>
                <SimpleGrid columnGap={6} columns={2} w="full">
                    {COUNT_PARAMS.map((param, i) =>
                        createNumericInputElement(
                            param,
                            0,
                            Infinity,
                            colResponsive(i + 1, 2),
                            i
                        )
                    )}
                </SimpleGrid>
            </VStack>

            {/* Bullet Parameters */}
            <VStack spacing={1} alignItems="flex-start" w="full">
                <Text fontSize="xl" color="blue.400" fontWeight="semibold">
                    Bullets
                </Text>
                <SimpleGrid columnGap={6} columns={2} rowGap={2} w="full">
                    <ColorPicker
                        gridInfo={colResponsive(1, 2)}
                        setColor={colorSetter}
                        color={patternParams.color}
                        display={DCP}
                        setDisplay={setDCP}
                    />
                    {createNumericInputElement(
                        'bulletRadius',
                        1,
                        Infinity,
                        colResponsive(2, 2),
                        2
                    )}
                </SimpleGrid>
                <SimpleGrid columnGap={6} columns={3} rowGap={2} w="full">
                    {BULLET_MOTION_PARAMS.map((param, i) =>
                        createNumericInputElement(
                            param,
                            0,
                            Infinity,
                            colResponsive(i + 1, 3),
                            i
                        )
                    )}
                    {BULLET_ROT_PARAMS.map((param, i) =>
                        createNumericInputElement(
                            param,
                            -180,
                            180,
                            colResponsive(i + 1, 3),
                            i,
                            true
                        )
                    )}
                    {createNumericInputElement(
                        'bulletMaxAngleChange',
                        0,
                        Infinity,
                        colResponsive(3, 3),
                        2,
                        true,
                        true
                    )}
                    {BULLET_LIMIT_PARAMS.map((param, i) =>
                        createNumericInputElement(
                            param,
                            -Infinity,
                            Infinity,
                            colResponsive(i + 1, 3),
                            i,
                            false,
                            true
                        )
                    )}
                </SimpleGrid>
            </VStack>
            {/* Path Params */}
            <VStack spacing={1} alignItems="flex-start" w="full">
                <Text
                    fontSize="xl"
                    color="blue.400"
                    fontWeight="semibold"
                    alignSelf="start"
                >
                    Source Path
                </Text>
                <RadioGroup
                    alignItems="start"
                    w="full"
                    h="fit-content"
                    defaultValue="None"
                    onChange={(value) => {
                        patternParams.pathType = value as pathType;
                        if (value !== 'None')
                            patternParams[PATH_TYPE_TO_PARAM[value]] =
                                defaultPathParams[PATH_TYPE_TO_PARAM[value]];
                        rerenderer();
                    }}
                >
                    <FormLabel>Path Type</FormLabel>
                    <Stack direction="row" spacing={4} flexWrap="wrap">
                        {PATH_TYPES.map((type, i) => (
                            <Radio value={type} key={i}>
                                {type}
                            </Radio>
                        ))}
                    </Stack>
                </RadioGroup>
                {pathTypeToEditor[patternParams.pathType]}
            </VStack>
        </VStack>
    );
};
