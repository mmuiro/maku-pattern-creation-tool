import { DEFAULTS, PatternArgs } from '../maku-classes/Pattern';
import React, { useCallback, useState } from 'react';
import Path from '../maku-classes/Path';
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
    Button,
} from '@chakra-ui/react';

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
}; // map from parameter name to label
const TIMING_PARAMS = ['startDelay', 'fireInterval'];
const SOURCE_INIT_PARAMS = ['initAngle', 'initX', 'initY'];
const SOURCE_ROT_PARAMS = ['rotationSpeed', 'spreadAngle'];
const COUNT_PARAMS = ['spokeCount', 'stackLength'];
const BULLET_VISUAL_PARAMS = ['color', 'bulletRadius'];
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
const BULLET_ROT_PARAMS = [
    'bulletLowerRotSpeed',
    'bulletUpperRotSpeed',
    'bulletMaxAngleChange',
];

interface GridParams {
    colStart: number;
    colSpan: number;
}

interface BooleanMap {
    [key: string]: Boolean;
}

interface PatternEditorArgs {
    patternSetter: Function;
}

// need toggles for setting whether to have reverse rotation, whether to have a upper speed/rotation speed (by default should equal to lower)

const PatternEditor: React.FC<any> = (props: PatternEditorArgs) => {
    const [patternParams, setPatternParams] = useState<PatternArgs>({
        ...DEFAULTS,
    });

    const [checkedParams, setCheckedParams] = useState<BooleanMap>({
        'Rotation Reversing': false,
    });

    const [preFreezeParams, setPreFreezeParams] = useState<PatternArgs>(
        (() => {
            let pre: PatternArgs = { ...DEFAULTS };
            for (let prop in pre) {
                if (
                    typeof pre[prop] === 'number' &&
                    !isFinite(pre[prop] as number)
                )
                    pre[prop] = 0;
            }
            return pre;
        })()
    );

    const colResponsive = (i: number, w: number) =>
        useBreakpointValue({
            base: { colStart: 0, colSpan: w },
            md: { colStart: i, colSpan: 1 },
        })!;

    const createNumericInputElement = useCallback(
        (
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
                setPatternParams({ ...patternParams });
                preFreezeParams[param] = val;
                setPreFreezeParams({ ...preFreezeParams });
            };
            let isInvalid = toggleable && !checkedParams[param];
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
                                isChecked={
                                    false || Boolean(checkedParams[param]!)
                                }
                                onChange={(e) => {
                                    checkedParams[param] = e.target.checked;
                                    setCheckedParams({ ...checkedParams });
                                    if (!e.target.checked) {
                                        patternParams[param] = DEFAULTS[param];
                                        setPatternParams({ ...patternParams });
                                    } else {
                                        patternParams[param] =
                                            preFreezeParams[param];
                                        setPatternParams({
                                            ...patternParams,
                                        });
                                    }
                                }}
                            ></Checkbox>
                        )}
                    </Flex>
                    <NumberInput
                        size="sm"
                        onChange={(valStr: string, valNum: number) => {
                            updateParam(valNum);
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
        },
        [patternParams, checkedParams]
    );

    const createSwitchElement = useCallback(
        (
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
                            checkedParams[param] = e.target.checked;
                            setCheckedParams({ ...checkedParams });
                            if (patternParams.hasOwnProperty(param)) {
                                patternParams[param] = e.target.checked;
                                setPatternParams({ ...patternParams });
                            }
                        }}
                        isDisabled={Boolean(disabledByExternal)}
                        size="lg"
                    >
                        <Text fontSize="sm">Enabled</Text>
                    </Checkbox>
                    <Text fontSize="md" fontWeight="semibold"></Text>
                </GridItem>
            );
        },
        [patternParams, checkedParams]
    );

    /* Used by each path-specific editor. */
    const pathSetter = (path: Path) => {
        patternParams.sourcePath = path;
        setPatternParams({ ...patternParams });
    };

    const submitChanges = useCallback(() => {
        props.patternSetter({ ...patternParams });
    }, [patternParams]);

    let submittable: Boolean = Object.entries(patternParams).every(
        (pair) =>
            typeof pair[1] !== 'number' ||
            (typeof pair[1] === 'number' && !isNaN(pair[1] as number))
    );

    return (
        <VStack spacing={4} justifyContent="flex-start">
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
                            0,
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
                            0,
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

            {/* Bullet Parameters */}
            <VStack spacing={1} alignItems="flex-start" w="full">
                <Text fontSize="xl" color="blue.400" fontWeight="semibold">
                    Bullets
                </Text>
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

            <Button
                size="sm"
                colorScheme="blue"
                onClick={(e) => submitChanges()}
                isDisabled={!submittable}
            >
                Apply
            </Button>
        </VStack>
    );
};

export default PatternEditor;
