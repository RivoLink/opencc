<?php

/**
 * @see https://cs.symfony.com/doc/rules/index.html
 */

declare(strict_types=1);

use PHP_CodeSniffer\Standards\Generic\Sniffs\CodeAnalysis\AssignmentInConditionSniff;
use PhpCsFixer\Fixer\ArrayNotation\ArraySyntaxFixer;
use PhpCsFixer\Fixer\Basic\CurlyBracesPositionFixer;
use PhpCsFixer\Fixer\CastNotation\CastSpacesFixer;
use PhpCsFixer\Fixer\ClassNotation\ClassAttributesSeparationFixer;
use PhpCsFixer\Fixer\ClassNotation\NoBlankLinesAfterClassOpeningFixer;
use PhpCsFixer\Fixer\ClassNotation\OrderedClassElementsFixer;
use PhpCsFixer\Fixer\DoctrineAnnotation\DoctrineAnnotationSpacesFixer;
use PhpCsFixer\Fixer\Operator\ConcatSpaceFixer;
use PhpCsFixer\Fixer\Operator\NotOperatorWithSuccessorSpaceFixer;
use PhpCsFixer\Fixer\Operator\StandardizeIncrementFixer;
use PhpCsFixer\Fixer\Strict\StrictComparisonFixer;
use PhpCsFixer\Fixer\Strict\StrictParamFixer;
use Symplify\CodingStandard\Fixer\ArrayNotation\ArrayListItemNewlineFixer;
use Symplify\CodingStandard\Fixer\ArrayNotation\ArrayOpenerAndCloserNewlineFixer;
use Symplify\CodingStandard\Fixer\ArrayNotation\StandaloneLineInMultilineArrayFixer;
use Symplify\CodingStandard\Fixer\LineLength\LineLengthFixer;
use Symplify\CodingStandard\Fixer\Spacing\MethodChainingNewlineFixer;
use Symplify\EasyCodingStandard\Config\ECSConfig;
use Symplify\EasyCodingStandard\ValueObject\Set\SetList;

return static function (ECSConfig $ecsConfig): void {
    $ecsConfig->parallel();

    $ecsConfig->cacheDirectory('.phpecs');

    $ecsConfig->paths([
        __DIR__ . '/scripts',
    ]);

    $ecsConfig->sets([
        SetList::CLEAN_CODE,
        SetList::COMMON,
        SetList::DOCTRINE_ANNOTATIONS,
        SetList::PSR_12,
        SetList::SYMPLIFY,
    ]);

    $ecsConfig->ruleWithConfiguration(ArraySyntaxFixer::class, [
        'syntax' => 'short',
    ]);

    $ecsConfig->ruleWithConfiguration(CurlyBracesPositionFixer::class, [
        // 'classes_opening_brace' => 'same_line',
        'functions_opening_brace' => 'same_line',
    ]);

    $ecsConfig->ruleWithConfiguration(CastSpacesFixer::class, [
        'space' => 'none',
    ]);

    $ecsConfig->ruleWithConfiguration(ClassAttributesSeparationFixer::class, [
        'elements' => ['method' => 'one'],
    ]);

    $ecsConfig->ruleWithConfiguration(ConcatSpaceFixer::class, [
        'spacing' => 'none',
    ]);

    $ecsConfig->ruleWithConfiguration(LineLengthFixer::class, [
        'line_length' => 75,
        'break_long_lines' => true,
        'inline_short_lines' => false,
    ]);

    $ecsConfig->skip([
        NoBlankLinesAfterClassOpeningFixer::class,
        // avoid converting `$i += 1` to `++$i`
        StandardizeIncrementFixer::class,
        //
        // The fixers below un-necessarily inflate whitespace
        //
        // avoid changing `$foo->bar()->baz()` to
        // $foo->bar()
        //     ->baz()
        MethodChainingNewlineFixer::class,
        // avoid converting `if (!$foo)` to `if (! $foo)`
        NotOperatorWithSuccessorSpaceFixer::class,
        // avoid changing `[1,2,3]` to
        // [
        //     1,
        //     2,
        //     3,
        // ]
        ArrayListItemNewlineFixer::class,
        StandaloneLineInMultilineArrayFixer::class,
        ArrayOpenerAndCloserNewlineFixer::class,
        // avoid changing Behat step definitions like `@Then (user) :user` to `@Then(user) :user`
        DoctrineAnnotationSpacesFixer::class => ['features/**/*Context.php'],
        // These will break the codebase, but we should enable them eventually
        StrictComparisonFixer::class,
        StrictParamFixer::class,
        // We do this a lot and it cannot be autofixed
        AssignmentInConditionSniff::class,
        // Enable in a separate PR due to diff noise
        OrderedClassElementsFixer::class,
    ]);
};
