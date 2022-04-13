import {
    Box,
    Button,
    Divider,
    Text,
    HStack,
    IconButton,
    VStack,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { Pattern, PatternArgs } from '../maku-classes/Pattern';
import { useState } from 'react';
import { ColorProps, PatternEditor } from '../components/PatternEditor';
import { BooleanMap, StringMap } from '../views/EditorPage';
import Color from '../maku-classes/Color';
import { AddIcon, PlusSquareIcon } from '@chakra-ui/icons';

interface EditorMenuProps {
    addPatternFn: Function;
    updater: Function;
    patternParamsList: React.MutableRefObject<PatternArgs[]>;
    patternParamsAsStringsList: React.MutableRefObject<StringMap[]>;
    patternCheckedParamsList: React.MutableRefObject<BooleanMap[]>;
    patternPreFreezeParamsList: React.MutableRefObject<PatternArgs[]>;
    children?: React.ReactNode;
    editorMode: Boolean;
    toggleEditor: Function;
}

const EditorMenu: React.FC<any> = (props: EditorMenuProps) => {
    const [displayColorPickers, setDisplayColorPickers] = useState<Boolean[]>(
        props.patternParamsList.current.map(() => false)
    );
    const keys = useRef<React.Key[]>([0]);

    const createHandleRemove = (i: number) => (e: any) => {
        e.preventDefault();
        props.patternParamsList.current.splice(i, 1);
        props.patternParamsAsStringsList.current.splice(i, 1);
        props.patternCheckedParamsList.current.splice(i, 1);
        props.patternPreFreezeParamsList.current.splice(i, 1);
        keys.current.splice(i, 1);
        props.updater();
    };

    const handleAdd = (e: any) => {
        e.preventDefault();
        keys.current.push(Number(keys.current[keys.current.length - 1]) + 1);
        props.addPatternFn();
    };

    const handleApplyChanges = (e: any) => {
        e.preventDefault();
        props.updater();
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
            props.updater();
        };
    };

    const createDisplaySetter = (i: number) => {
        return (state: Boolean) => {
            displayColorPickers[i] = state;
            setDisplayColorPickers([...displayColorPickers]);
        };
    };

    return (
        <VStack py={1} maxH="full" borderRadius="md" borderColor="gray.100">
            <Text
                color="blue.400"
                alignSelf="start"
                fontSize="2xl"
                fontWeight="semibold"
                px={2}
            >
                Editor
            </Text>
            <Divider orientation="horizontal" />
            <Box
                pl={2}
                pr={6}
                maxH="full"
                mb={2}
                w="full"
                overflowY="scroll"
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#EDF2F7',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#E2E8F0',
                    },
                }}
                position="relative"
            >
                {props.patternParamsList.current.map((params, i) => (
                    <React.Fragment key={keys.current[i]}>
                        <PatternEditor
                            patternParams={props.patternParamsList.current[i]}
                            patternParamsAsStrings={
                                props.patternParamsAsStringsList.current[i]
                            }
                            preFreezeParams={
                                props.patternPreFreezeParamsList.current[i]
                            }
                            checkedParams={
                                props.patternCheckedParamsList.current[i]
                            }
                            updater={props.updater}
                            colorSetter={createColorSetter(i)}
                            DCP={displayColorPickers[i]}
                            setDCP={createDisplaySetter(i)}
                            removeSelf={createHandleRemove(i)}
                            title={`Pattern ${i + 1}`}
                            canRemove={
                                props.patternParamsList.current.length > 1
                            }
                            editorMode={props.editorMode}
                        />
                        {i < keys.current.length - 1 && (
                            <Divider orientation="horizontal" my={4} />
                        )}
                    </React.Fragment>
                ))}
            </Box>
            <Divider orientation="horizontal" />
            <HStack spacing={4}>
                <Button
                    onClick={(e) => {
                        if (props.editorMode) handleApplyChanges(e);
                        props.toggleEditor();
                    }}
                    colorScheme="twitter"
                    variant="ghost"
                >
                    {props.editorMode ? 'Disable Editor' : 'Enable Editor'}
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
