import { ColorChangeHandler, ColorResult, SketchPicker } from 'react-color';
import { Box, Flex, FormLabel, GridItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ColorProps, GridParams } from './PatternEditor';

interface ColorPickerProps {
    gridInfo: GridParams;
    color: ColorProps;
    setColor: Function;
    display: Boolean;
    setDisplay: Function;
    enabled: Boolean;
}

const ColorPicker: React.FC<any> = (props: ColorPickerProps) => {
    let { color, setColor, display, setDisplay, enabled } = props;

    if (!enabled && display) setDisplay(false);

    const handleChange: ColorChangeHandler = (
        resColor: ColorResult,
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.preventDefault();
        setColor({ ...resColor.rgb, a: resColor.rgb.a! });
    };

    return (
        <GridItem
            colStart={props.gridInfo.colStart}
            colSpan={props.gridInfo.colSpan}
            position="relative"
            alignSelf="flex-end"
        >
            <FormLabel fontSize="sm">Color</FormLabel>
            <Flex
                p={1.5}
                bgColor={'gray.100'}
                transitionProperty="all"
                transitionDuration="0.25s"
                _hover={{
                    background: 'gray.200',
                }}
                h="fit-content"
                rounded="sm"
                cursor="pointer"
                maxW={'100%'}
            >
                <Box
                    bgColor={`rgba(${color.r},${color.g},${color.b},${color.a})`}
                    h={5}
                    flexGrow={1}
                    onClick={() => (enabled ? setDisplay(!display) : 0)}
                    rounded="sm"
                ></Box>
            </Flex>
            {display && (
                <>
                    <Box
                        position="fixed"
                        top={0}
                        left={0}
                        right={0}
                        bottom={0}
                        onClick={() => setDisplay(false)}
                    ></Box>
                    <Box position="absolute" zIndex={50} my={2} h="fit-content">
                        <SketchPicker
                            color={color}
                            onChange={handleChange}
                        ></SketchPicker>
                    </Box>
                </>
            )}
        </GridItem>
    );
};

export default ColorPicker;
