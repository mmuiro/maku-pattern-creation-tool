import React, { useCallback, useState, useRef } from 'react';
import { Box, Divider, Flex, useBreakpointValue } from '@chakra-ui/react';
import Canvas from '../components/Canvas';
import EditorMenu from '../components/EditorMenu';
import { DEFAULTS, PatternArgs } from '../maku-classes/Pattern';

export interface BooleanMap {
    [key: string]: Boolean;
}

export interface StringMap {
    [key: string]: string;
}

const EditorPage: React.FC<any> = () => {
    const getDefaultPreFreezeParams = () => {
        let pre: PatternArgs = { ...DEFAULTS };
        for (let prop in pre) {
            if (typeof pre[prop] === 'number' && !isFinite(pre[prop] as number))
                pre[prop] = 0;
        }
        return pre;
    };

    const DEFAULTS_AS_STRINGS = (() => {
        let ret: StringMap = {};
        for (const [key, value] of Object.entries(DEFAULTS)) {
            ret[key] = String(value);
        }
        return ret;
    })();

    const [patternParamsList, setPatternParamsList] = useState<PatternArgs[]>([
        { ...DEFAULTS },
    ]);
    const editorParamsList = useRef<PatternArgs[]>([{ ...DEFAULTS }]);
    const editorParamsAsStringsList = useRef<StringMap[]>([
        { ...DEFAULTS_AS_STRINGS },
    ]);
    const editorCheckedParamsList = useRef<BooleanMap[]>([
        { 'Rotation Reversing': false },
    ]);
    const editorPreFreezeParamsList = useRef<PatternArgs[]>([
        getDefaultPreFreezeParams(),
    ]);

    const [editorMode, setEditorMode] = useState(true);
    const updatePatterns = () => {
        setPatternParamsList([...editorParamsList.current]);
    };

    const addPattern = useCallback(() => {
        editorParamsList.current.push({ ...DEFAULTS });
        editorParamsAsStringsList.current.push({ ...DEFAULTS_AS_STRINGS });
        editorCheckedParamsList.current.push({ 'Rotation Reversing': false });
        editorPreFreezeParamsList.current.push(getDefaultPreFreezeParams());
        updatePatterns();
    }, [patternParamsList, updatePatterns]);

    const toggleEditor = () => {
        setEditorMode(!editorMode);
    };

    const canvasAR: number = useBreakpointValue({
        base: 1,
        lg: ((window.innerWidth / window.innerHeight) * 2) / 3,
    })!;

    const baseSize = 1600;
    console.log(canvasAR);
    return (
        <Flex h="100vh" direction={{ base: 'column', xl: 'row' }}>
            <Box
                margin={4}
                boxShadow="xl"
                borderColor="blue.300"
                maxH={{ base: window.innerWidth, xl: 'full' }}
                maxW="fit-content"
                borderRadius="lg"
                overflow="hidden"
            >
                <Canvas
                    width={canvasAR * baseSize}
                    height={baseSize}
                    patterns={patternParamsList}
                    editorMode={editorMode}
                    editorParamsList={editorParamsList.current}
                    editorParamsAsStringsList={
                        editorParamsAsStringsList.current
                    }
                    updater={updatePatterns}
                ></Canvas>
            </Box>
            <Box
                flexGrow={1}
                flexBasis={0}
                my={4}
                mx={1}
                position="relative"
                maxH="full"
            >
                <EditorMenu
                    addPatternFn={addPattern}
                    updater={updatePatterns}
                    patternParamsList={editorParamsList}
                    patternParamsAsStringsList={editorParamsAsStringsList}
                    patternCheckedParamsList={editorCheckedParamsList}
                    patternPreFreezeParamsList={editorPreFreezeParamsList}
                    editorMode={editorMode}
                    toggleEditor={toggleEditor}
                />
            </Box>
        </Flex>
    );
};

export default EditorPage;
