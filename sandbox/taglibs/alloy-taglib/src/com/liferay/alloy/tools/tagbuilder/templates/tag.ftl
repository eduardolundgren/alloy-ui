<#include "copyright.ftl">

package ${packagePath}.${component.getPackage()};
<#if component.getWriteBaseClass() == true>
import ${packagePath}.${component.getPackage()}.base.Base${component.getClassName()};
</#if>
/**
<#list component.getAuthors() as author>
 * @author ${author}
</#list>
 */
<#if component.getWriteBaseClass() == true>
public class ${component.getClassName()} extends Base${component.getClassName()} {
<#else>
public class ${component.getClassName()} extends ${component.getParentClass()} {
</#if>
}