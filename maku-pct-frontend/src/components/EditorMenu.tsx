import {
    Box,
    Button,
    Divider,
    HStack,
    IconButton,
    VStack,
} from '@chakra-ui/react';
import React from 'react';
import { Pattern, PatternArgs } from '../maku-classes/Pattern';
import { useState } from 'react';
import { ColorProps, PatternEditor } from '../components/PatternEditor';
import { BooleanMap } from '../views/EditorPage';
import Color from '../maku-classes/Color';
import { AddIcon, PlusSquareIcon } from '@chakra-ui/icons';

interface EditorMenuProps {
    addPatternFn: Function;
    updatePatterns: Function;
    patternParamsList: React.MutableRefObject<PatternArgs[]>;
    patternCheckedParamsList: React.MutableRefObject<BooleanMap[]>;
    patternPreFreezeParamsList: React.MutableRefObject<PatternArgs[]>;
    children?: React.ReactNode;
}

const EditorMenu: React.FC<any> = (props: EditorMenuProps) => {
    const [rerender, setter] = useState<Boolean>(false);
    const [displayColorPickers, setDisplayColorPickers] = useState<Boolean[]>(
        props.patternParamsList.current.map(() => false)
    );

    const forceRerender = () => {
        setter(!rerender);
    };

    const handleAdd = (e: any) => {
        e.preventDefault();
        props.addPatternFn();
    };

    const handleApplyChanges = (e: any) => {
        e.preventDefault();
        props.updatePatterns();
    };

    const createColorSetter = (i: number) => {
        return (color: ColorProps) => {
            props.patternParamsList.current[i].color = new Color(
                color.r,
                color.g,
                color.b,
                color.a
            );
            props.patternPreFreezeParamsList.current[i].color = new Color(
                color.r,
                color.g,
                color.b,
                color.a
            );
            forceRerender();
        };
    };

    const createDisplaySetter = (i: number) => {
        return (state: Boolean) => {
            displayColorPickers[i] = state;
            setDisplayColorPickers([...displayColorPickers]);
        };
    };

    return (
        <VStack py={2}>
            <Box pl={2} pr={6} maxH="full" mb={2} w="full">
                {props.patternParamsList.current.map((params, i) => (
                    <React.Fragment key={i}>
                        <PatternEditor
                            patternParams={props.patternParamsList.current[i]}
                            preFreezeParams={
                                props.patternPreFreezeParamsList.current[i]
                            }
                            checkedParams={
                                props.patternCheckedParamsList.current[i]
                            }
                            rerenderer={forceRerender}
                            colorSetter={createColorSetter(i)}
                            DCP={displayColorPickers[i]}
                            setDCP={createDisplaySetter(i)}
                        />
                        <Divider orientation="horizontal" my={4} />
                    </React.Fragment>
                ))}
            </Box>
            <HStack>
                <Button
                    onClick={handleApplyChanges}
                    colorScheme="twitter"
                    variant="outline"
                >
                    Apply Changes
                </Button>
                <IconButton
                    aria-label="Add Pattern"
                    onClick={handleAdd}
                    colorScheme="twitter"
                    icon={<AddIcon />}
                />
            </HStack>
        </VStack>
    );
};

export default EditorMenu;
